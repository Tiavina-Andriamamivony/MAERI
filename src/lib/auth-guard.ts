import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";
import { ok, fail, type ActionResult } from "@/lib/action-result";

/**
 * Garde d'authentification pour les server actions qui écrivent en base.
 * Résout l'utilisateur Clerk courant vers son enregistrement Prisma (lié par
 * `clerkId`). Comme l'inscription est désactivée côté Clerk, tout utilisateur
 * connecté est de fait autorisé.
 */
export async function requireUser(): Promise<ActionResult<{ id: string }>> {
  const { userId: clerkId } = await auth();
  if (!clerkId) return fail("Utilisateur non authentifié");

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) return fail("Utilisateur introuvable");

  return ok({ id: user.id });
}
