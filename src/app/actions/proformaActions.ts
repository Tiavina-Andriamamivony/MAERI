"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { assertAdmin, requireAdmin } from "@/lib/auth-guard";
import { ok, fail, type ActionResult } from "@/lib/action-result";
import { firstError } from "@/lib/validations/first-error";
import {
  proformaSchema,
  type ProformaInput,
} from "@/lib/validations/proforma";
import { amountInWords } from "@/lib/facturation/amount-in-words";
import { lineTotals, proformaTotals } from "@/lib/facturation/totals";
import { renderProformaPdf } from "@/lib/facturation/proforma-pdf";
import { deleteImage, uploadPdf } from "@/lib/blob";
import { Proforma, ProformaItem } from "../generated/prisma/client";

export type ProformaWithItems = Proforma & { items: ProformaItem[] };

/** Code d'erreur Prisma d'une violation de contrainte d'unicité. */
const UNIQUE_VIOLATION_CODE = "P2002";

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === UNIQUE_VIOLATION_CODE
  );
}

export default async function getProformas(): Promise<ProformaWithItems[]> {
  await assertAdmin();
  return prisma.proforma.findMany({
    include: { items: true },
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
  const user = await requireAdmin();
  if (!user.success) return user;

  const existing = await prisma.proforma.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!existing) return fail("Proforma introuvable.");

  await prisma.proforma.delete({ where: { id } });
  await deleteImage(existing.pdf_url);

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
  const user = await requireAdmin();
  if (!user.success) return user;

  const input = proformaSchema.safeParse(payload);
  if (!input.success) return fail(firstError(input.error));

  const data = input.data;
  const totals = proformaTotals(data.items, data.tva_active, data.tva_rate);

  let pdfUrl: string;
  try {
    const pdf = await renderProformaPdf(data);
    pdfUrl = await uploadPdf(pdf, `${data.pf_num}.pdf`);
  } catch {
    return fail("Impossible de générer ou stocker le PDF du proforma.");
  }

  try {
    const proforma = await prisma.proforma.create({
      data: {
        pf_num: data.pf_num,
        date: data.date,
        // Copie figée des données client.
        client_code: data.client_code,
        client_name: data.client_name,
        client_address: data.client_address,
        client_province: data.client_province,
        client_nif: data.client_nif,
        client_stat: data.client_stat,
        client_rcs: data.client_rcs,
        client_contact: data.client_contact,
        client_phone: data.client_phone,
        client_mail: data.client_mail,
        // Conditions commerciales.
        votre_reference: data.votre_reference,
        validite_offre: data.validite_offre,
        terme_paiement: data.terme_paiement,
        monnaie: data.monnaie,
        tva_active: data.tva_active,
        tva_rate: data.tva_rate,
        // Totaux recalculés côté serveur, jamais repris du client.
        sous_total: totals.sous_total,
        remise: totals.remise,
        montant_net: totals.montant_net,
        montant_tva: totals.montant_tva,
        montant_total: totals.montant_total,
        montant_en_lettres: amountInWords(totals.montant_total),
        pdf_url: pdfUrl,
        items: {
          create: data.items.map((item) => ({
            // Copie figée des données article.
            designation: item.designation,
            max_loading: item.max_loading,
            pressure: item.pressure,
            dimension: item.dimension,
            uom: item.uom,
            quantite: item.quantite,
            prix_unitaire: item.prix_unitaire,
            remise_pct: item.remise_pct,
            montant_net: lineTotals(item).net,
          })),
        },
      },
      include: { items: true },
    });

    revalidatePath("/admin/facturation/proforma");
    return ok(proforma);
  } catch (error) {
    // Le PDF a déjà été stocké : on le retire pour ne pas laisser d'orphelin.
    await deleteImage(pdfUrl);
    if (isUniqueViolation(error)) {
      return fail("Ce numéro de proforma existe déjà.");
    }
    throw error;
  }
}
