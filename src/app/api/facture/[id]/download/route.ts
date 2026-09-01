import { NextRequest } from "next/server";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin();
  if (!admin.success) {
    return Response.json(
      { error: admin.error, code: admin.code },
      { status: admin.status },
    );
  }

  const { id } = await params;
  const factureId = Number(id);
  if (Number.isNaN(factureId)) {
    console.warn("[facture:download] ID invalide : %s", id);
    return Response.json(
      { error: "ID invalide", code: "INVALID_ID" },
      { status: 400 },
    );
  }

  const facture = await prisma.facture.findUnique({
    where: { id: factureId },
    select: { pdf_url: true, facture_num: true },
  });

  if (!facture) {
    return Response.json(
      { error: "Facture introuvable", code: "FACTURE_NOT_FOUND" },
      { status: 404 },
    );
  }

  console.log("[facture:download] Serving PDF for facture %d (%s)", factureId, facture.facture_num);
  return Response.redirect(facture.pdf_url);
}
