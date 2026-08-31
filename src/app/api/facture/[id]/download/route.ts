import { NextRequest } from "next/server";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";

export const runtime = "nodejs";

/**
 * Téléchargement du PDF d'une facture déjà enregistrée. Redirige vers l'URL
 * Vercel Blob stockée en base (`pdf_url`).
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin();
  if (!admin.success) {
    return Response.json({ error: admin.error }, { status: 401 });
  }

  const { id } = await params;
  const factureId = Number(id);
  if (Number.isNaN(factureId)) {
    return Response.json({ error: "ID invalide" }, { status: 400 });
  }

  const facture = await prisma.facture.findUnique({
    where: { id: factureId },
    select: { pdf_url: true, facture_num: true },
  });

  if (!facture) {
    return Response.json({ error: "Facture introuvable" }, { status: 404 });
  }

  return Response.redirect(facture.pdf_url);
}
