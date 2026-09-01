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
  factureSchema,
  type FactureInput,
} from "@/lib/validations/facture";
import { amountInWords } from "@/lib/facturation/amount-in-words";
import { lineTotals, computeTotals } from "@/lib/facturation/totals";
import { renderFacturePdf } from "@/lib/facturation/facture-pdf";
import { deleteBlob, uploadPdf } from "@/lib/blob";
import { isUniqueViolation } from "@/lib/facturation/prisma-errors";
import { Facture, FactureItem, Client } from "../generated/prisma/client";

export type FactureWithItems = Facture & { items: FactureItem[]; client: Client | null };

export default async function getFactures(): Promise<FactureWithItems[]> {
  const auth = await requireAdmin();
  if (!auth.success) return [];

  return prisma.facture.findMany({
    include: { items: true, client: true },
    orderBy: { created_at: "desc" },
  });
}

/**
 * Supprime une facture et son PDF stocké dans Vercel Blob. Les lignes de la
 * facture sont supprimées en cascade par Prisma (`onDelete: Cascade`).
 */
export async function deleteFacture(
  id: number,
): Promise<ActionResult<FactureWithItems>> {
  const auth = await requireAdmin();
  if (!auth.success) return auth;

  const existing = await prisma.facture.findUnique({
    where: { id },
    include: { items: true, client: true },
  });
  if (!existing) {
    return notFound("Facture introuvable.", "FACTURE_NOT_FOUND");
  }

  console.log("[facture] Suppression de la facture #%d (%s)", id, existing.facture_num);
  await prisma.facture.delete({ where: { id } });
  await deleteBlob(existing.pdf_url);

  revalidatePath("/admin/facturation/facture");
  return ok(existing);
}

/**
 * Crée une facture : revalide le payload (zod), recalcule les totaux côté
 * serveur, rend le PDF, le stocke dans Vercel Blob puis persiste le document
 * et ses lignes. La facture est immuable après sauvegarde.
 */
export async function createFacture(
  payload: FactureInput,
): Promise<ActionResult<FactureWithItems>> {
  const auth = await requireAdmin();
  if (!auth.success) return auth;

  const input = factureSchema.safeParse(payload);
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
    const pdf = await renderFacturePdf(data, client);
    pdfUrl = await uploadPdf(pdf, `${data.facture_num}.pdf`);
  } catch (error) {
    console.error("[facture] Échec de la génération/upload du PDF :", error);
    return fail(
      "Impossible de générer ou stocker le PDF de la facture.",
      500,
      "PDF_GENERATION_FAILED",
    );
  }

  try {
    const facture = await prisma.facture.create({
      data: {
        facture_num: data.facture_num,
        date: data.date,
        client: { connect: { id: data.client_id } },
        votre_reference: data.votre_reference,
        monnaie: data.monnaie,
        tva_active: data.tva_active,
        tva_rate: data.tva_rate,
        date_paiement: data.date_paiement ?? null,
        livraison: data.livraison,
        paiement: data.paiement,
        ...(data.proforma_id ? { proforma: { connect: { id: data.proforma_id } } } : {}),
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

    console.log("[facture] Facture créée #%d (%s)", facture.id, facture.facture_num);
    revalidatePath("/admin/facturation/facture");
    return ok(facture);
  } catch (error) {
    await deleteBlob(pdfUrl);
    if (isUniqueViolation(error)) {
      return conflict(
        `Le numéro de facture « ${data.facture_num} » existe déjà.`,
        "FACTURE_NUM_DUPLICATE",
      );
    }
    console.error("[facture] Erreur inattendue de la base de données :", error);
    return fail("Erreur interne lors de la création de la facture.", 500, "INTERNAL_ERROR");
  }
}
