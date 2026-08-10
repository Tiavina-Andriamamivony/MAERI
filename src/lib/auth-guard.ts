import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";
import { ok, fail, type ActionResult } from "@/lib/action-result";

/** Message unique : ne pas révéler si l'échec vient de la session ou du rôle. */
const DENIED = "Accès refusé";

/**
 * Garde d'autorisation de l'espace admin. Un compte Clerk connecté ne suffit
 * pas : il faut `publicMetadata.role === "admin"`, posé manuellement depuis le
 * Dashboard Clerk (Users → un utilisateur → Metadata → Public). Le rôle est lu
 * dans le session token, donc sans appel réseau — voir `src/types/globals.d.ts`
 * pour le claim à déclarer côté Dashboard.
 *
 * Résout ensuite l'utilisateur Prisma lié par `clerkId`, requis pour rattacher
 * les écritures à un propriétaire. La ligne est créée si elle manque : ce n'est
 * pas un contrôle d'accès (l'autorisation vient du claim signé par Clerk), juste
 * un pointeur de propriété. Sans ça, un webhook `user.created` manqué
 * verrouillerait l'admin hors de son propre espace. Les champs `name` / `email`
 * sont renseignés par le webhook Clerk.
 */
export async function requireAdmin(): Promise<ActionResult<{ id: string }>> {
  const { userId: clerkId, sessionClaims } = await auth();
  if (!clerkId) return fail(DENIED);
  if (sessionClaims?.metadata?.role !== "admin") return fail(DENIED);

  const user = await prisma.user.upsert({
    where: { clerkId },
    update: {},
    create: { clerkId },
  });

  return ok({ id: user.id });
}

/**
 * Variante levée, pour les lectures qui renvoient directement des données.
 * Toute fonction `"use server"` exportée est un endpoint public appelable
 * depuis l'extérieur : les lectures sensibles doivent aussi être gardées.
 */
export async function assertAdmin(): Promise<void> {
  const result = await requireAdmin();
  if (!result.success) throw new Error(result.error);
}
