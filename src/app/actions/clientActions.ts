"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { ok, fail, notFound, type ActionResult } from "@/lib/action-result";
import {
  createWithAllocatedKey,
  nextClientCode,
} from "@/lib/analyse/next-code";
import { firstError } from "@/lib/validations/first-error";
import {
  createClientSchema,
  updateClientSchema,
} from "@/lib/validations/analyse";
import { Client } from "../generated/prisma/client";

export default async function getClients(): Promise<Client[]> {
  const auth = await requireAdmin();
  if (!auth.success) return [];

  return await prisma.client.findMany({ orderBy: { code_client: "asc" } });
}

export async function createClient(
  formData: FormData,
): Promise<ActionResult<Client>> {
  const auth = await requireAdmin();
  if (!auth.success) return auth;

  const input = createClientSchema.safeParse(Object.fromEntries(formData));
  if (!input.success) return fail(firstError(input.error), 422, "VALIDATION_ERROR");

  const client = await createWithAllocatedKey(async () =>
    prisma.client.create({
      data: { ...input.data, code_client: await nextClientCode() },
    }),
  );

  console.log("[client] Client créé #%d (code: %d)", client.id, client.code_client);
  revalidatePath("/admin/analyses");
  return ok(client);
}

export async function updateClient(
  formData: FormData,
): Promise<ActionResult<Client>> {
  const auth = await requireAdmin();
  if (!auth.success) return auth;

  const input = updateClientSchema.safeParse(Object.fromEntries(formData));
  if (!input.success) return fail(firstError(input.error), 422, "VALIDATION_ERROR");

  const { id, ...data } = input.data;
  const client = await prisma.client.update({ where: { id }, data });

  console.log("[client] Client mis à jour #%d", id);
  revalidatePath("/admin/analyses");
  return ok(client);
}

export async function deleteClient(id: number): Promise<ActionResult<Client>> {
  const auth = await requireAdmin();
  if (!auth.success) return auth;

  try {
    const client = await prisma.client.delete({ where: { id } });
    console.log("[client] Client supprimé #%d", id);
    revalidatePath("/admin/analyses");
    return ok(client);
  } catch {
    return notFound("Client introuvable ou déjà supprimé.", "CLIENT_NOT_FOUND");
  }
}
