import { getDownloadUrl } from "@vercel/blob";
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
  const proformaId = Number(id);
  if (Number.isNaN(proformaId)) {
    console.warn("[proforma:download] ID invalide : %s", id);
    return Response.json(
      { error: "ID invalide", code: "INVALID_ID" },
      { status: 400 },
    );
  }

  const proforma = await prisma.proforma.findUnique({
    where: { id: proformaId },
    select: { pdf_url: true, pf_num: true },
  });
  if (!proforma) {
    console.warn("[proforma:download] Proforma introuvable #%d", proformaId);
    return Response.json(
      { error: "Proforma introuvable", code: "PROFORMA_NOT_FOUND" },
      { status: 404 },
    );
  }

  console.log("[proforma:download] Envoi du PDF pour le proforma #%d (%s)", proformaId, proforma.pf_num);
  return Response.redirect(getDownloadUrl(proforma.pdf_url));
}
