"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/auth-guard";
import { ok, fail, type ActionResult } from "@/lib/action-result";
import { firstError } from "@/lib/validations/first-error";
import {
  createClientSchema,
  updateClientSchema,
} from "@/lib/validations/analyse";
import { Client } from "../generated/prisma/client";

export default async function getClients(): Promise<Client[]> {
  return prisma.client.findMany({ orderBy: { code_client: "asc" } });
}

export async function createClient(
  formData: FormData,
): Promise<ActionResult<Client>> {
  const user = await requireUser();
  if (!user.success) return user;

  const input = createClientSchema.safeParse(Object.fromEntries(formData));
  if (!input.success) return fail(firstError(input.error));

  // Le code client est unique : refuser plutôt que de créer un doublon.
  const existing = await prisma.client.findUnique({
    where: { code_client: input.data.code_client },
  });
  if (existing) {
    return fail(`Le code client « ${input.data.code_client} » existe déjà.`);
  }

  const client = await prisma.client.create({ data: input.data });

  revalidatePath("/admin/analyses");
  return ok(client);
}

export async function updateClient(
  formData: FormData,
): Promise<ActionResult<Client>> {
  const user = await requireUser();
  if (!user.success) return user;

  const input = updateClientSchema.safeParse(Object.fromEntries(formData));
  if (!input.success) return fail(firstError(input.error));

  const { id, ...data } = input.data;
  const client = await prisma.client.update({ where: { id }, data });

  revalidatePath("/admin/analyses");
  return ok(client);
}

export async function deleteClient(id: number): Promise<ActionResult<Client>> {
  const user = await requireUser();
  if (!user.success) return user;

  try {
    const client = await prisma.client.delete({ where: { id } });
    revalidatePath("/admin/analyses");
    return ok(client);
  } catch {
    // Prisma lève P2025 si la ligne n'existe plus (déjà supprimée ailleurs).
    return fail("Client introuvable ou déjà supprimé.");
  }
}
