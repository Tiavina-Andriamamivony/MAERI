import { NextRequest } from "next/server";

import { requireAdmin } from "@/lib/auth-guard";
import { firstError } from "@/lib/validations/first-error";
import { factureSchema } from "@/lib/validations/facture";
import { renderFacturePdf } from "@/lib/facturation/facture-pdf";

export const runtime = "nodejs";

/**
 * Aperçu PDF de la facture, généré à la volée avant toute sauvegarde : rien
 * n'est écrit en base ni dans Vercel Blob. Même schéma zod que la server
 * action, pour que l'aperçu soit exactement le document qui sera sauvegardé.
 */
export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin.success) {
    return Response.json({ error: admin.error }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "JSON invalide" }, { status: 400 });
  }

  const input = factureSchema.safeParse(payload);
  if (!input.success) {
    return Response.json({ error: firstError(input.error) }, { status: 422 });
  }

  const pdf = await renderFacturePdf(input.data);
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="facture-apercu.pdf"',
    },
  });
}
