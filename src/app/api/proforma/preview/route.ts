import { NextRequest } from "next/server";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { firstError } from "@/lib/validations/first-error";
import { proformaSchema } from "@/lib/validations/proforma";
import { renderProformaPdf } from "@/lib/facturation/proforma-pdf";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin.success) {
    return Response.json(
      { error: admin.error, code: admin.code },
      { status: admin.status },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json(
      { error: "JSON invalide", code: "INVALID_JSON" },
      { status: 400 },
    );
  }

  const input = proformaSchema.safeParse(payload);
  if (!input.success) {
    return Response.json(
      { error: firstError(input.error), code: "VALIDATION_ERROR" },
      { status: 422 },
    );
  }

  const client = await prisma.client.findUnique({
    where: { id: input.data.client_id },
  });
  if (!client) {
    return Response.json(
      { error: "Client introuvable", code: "CLIENT_NOT_FOUND" },
      { status: 404 },
    );
  }

  const pdf = await renderProformaPdf(input.data, client);
  console.log("[proforma:preview] PDF rendu pour le proforma %s", input.data.pf_num);
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="proforma-apercu.pdf"',
    },
  });
}
