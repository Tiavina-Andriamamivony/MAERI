"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import {
  ok,
  fail,
  notFound,
  conflict,
  validationError,
  type ActionResult,
} from "@/lib/action-result";
import { firstError } from "@/lib/validations/first-error";
import {
  proformaSchema,
  type ProformaInput,
} from "@/lib/validations/proforma";
import { amountInWords } from "@/lib/facturation/amount-in-words";
import { lineTotals, computeTotals } from "@/lib/facturation/totals";
import { renderProformaPdf } from "@/lib/facturation/proforma-pdf";
import { deleteBlob, uploadPdf } from "@/lib/blob";
import { isUniqueViolation } from "@/lib/facturation/prisma-errors";
import { Proforma, ProformaItem, Client } from "../generated/prisma/client";

export type ProformaWithItems = Proforma & { items: ProformaItem[]; client: Client | null };

export default async function getProformas(): Promise<ProformaWithItems[]> {
  const auth = await requireAdmin();
  if (!auth.success) return [];

  return prisma.proforma.findMany({
    include: { items: true, client: true },
    orderBy: { created_at: "desc" },
  });
}

/**
 * Supprime un proforma et son PDF stocké dans Vercel Blob. Les lignes du
 * proforma sont supprimées en cascade par Prisma (`onDelete: Cascade`).
 */
export async function deleteProforma(
  id: number,
): Promise<ActionResult<ProformaWithItems>> {
  const auth = await requireAdmin();
  if (!auth.success) return auth;

  const existing = await prisma.proforma.findUnique({
    where: { id },
    include: { items: true, client: true },
  });
  if (!existing) {
    return notFound("Proforma introuvable.", "PROFORMA_NOT_FOUND");
  }

  console.log("[proforma] Suppression du proforma #%d (%s)", id, existing.pf_num);
  await prisma.proforma.delete({ where: { id } });
  await deleteBlob(existing.pdf_url);

  revalidatePath("/admin/facturation/proforma");
  return ok(existing);
}

/**
 * Crée un proforma : revalide le payload (zod), recalcule les totaux côté
 * serveur, rend le PDF, le stocke dans Vercel Blob puis persiste le document
 * et ses lignes. Le proforma est immuable après sauvegarde.
 */
export async function createProforma(
  payload: ProformaInput,
): Promise<ActionResult<ProformaWithItems>> {
  const auth = await requireAdmin();
  if (!auth.success) return auth;

  const input = proformaSchema.safeParse(payload);
  if (!input.success) {
    return validationError(firstError(input.error));
  }

  const data = input.data;

  const client = await prisma.client.findUnique({
    where: { id: data.client_id },
  });
  if (!client) {
    return notFound("Client introuvable.", "CLIENT_NOT_FOUND");
  }

  const totals = computeTotals(data.items, data.tva_active, data.tva_rate);

  let pdfUrl: string;
  try {
    const pdf = await renderProformaPdf(data, client);
    pdfUrl = await uploadPdf(pdf, `${data.pf_num}.pdf`);
  } catch (error) {
    console.error("[proforma] Échec de la génération/upload du PDF :", error);
    return fail(
      "Impossible de générer ou stocker le PDF du proforma.",
      500,
      "PDF_GENERATION_FAILED",
    );
  }

  try {
    const proforma = await prisma.proforma.create({
      data: {
        pf_num: data.pf_num,
        date: data.date,
        client: { connect: { id: data.client_id } },
        votre_reference: data.votre_reference,
        validite_offre: data.validite_offre,
        terme_paiement: data.terme_paiement,
        monnaie: data.monnaie,
        tva_active: data.tva_active,
        tva_rate: data.tva_rate,
        cif: data.cif,
        delai_livraison: data.delai_livraison,
        conditions_paiement: data.conditions_paiement,
        sous_total: totals.sous_total,
        remise: totals.remise,
        montant_net: totals.montant_net,
        montant_tva: totals.montant_tva,
        montant_total: totals.montant_total,
        montant_en_lettres: amountInWords(totals.montant_total),
        pdf_url: pdfUrl,
        items: {
          create: data.items.map((item) => ({
            designation: item.designation,
            uom: item.uom,
            quantite: item.quantite,
            prix_unitaire: item.prix_unitaire,
            remise_pct: item.remise_pct,
            montant_net: lineTotals(item).net,
          })),
        },
      },
      include: { items: true, client: true },
    });

    console.log("[proforma] Proforma créé #%d (%s)", proforma.id, proforma.pf_num);
    revalidatePath("/admin/facturation/proforma");
    return ok(proforma);
  } catch (error) {
    await deleteBlob(pdfUrl);
    if (isUniqueViolation(error)) {
      return conflict(
        `Le numéro de proforma « ${data.pf_num} » existe déjà.`,
        "PROFORMA_NUM_DUPLICATE",
      );
    }
    console.error("[proforma] Erreur inattendue de la base de données :", error);
    return fail("Erreur interne lors de la création du proforma.", 500, "INTERNAL_ERROR");
  }
}
