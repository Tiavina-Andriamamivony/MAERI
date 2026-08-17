import { getDownloadUrl } from "@vercel/blob";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";

export const runtime = "nodejs";

/**
 * Télécharge le PDF d'un proforma sauvegardé. Le blob Vercel est public mais
 * le téléchargement reste réservé à l'admin. On redirige vers l'URL de
 * téléchargement du SDK (`?download=1`) : le CDN sert le fichier en pièce
 * jointe directement au navigateur, sans faire transiter les octets par le
 * serveur Next (et sans dépendre de la connectivité du serveur vers le CDN).
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin();
  if (!admin.success) {
    return Response.json({ error: admin.error }, { status: 401 });
  }

  const { id } = await params;
  const proforma = await prisma.proforma.findUnique({
    where: { id: Number(id) },
    select: { pdf_url: true },
  });
  if (!proforma) {
    return Response.json({ error: "Proforma introuvable" }, { status: 404 });
  }

  return NextResponse.redirect(getDownloadUrl(proforma.pdf_url));
}
