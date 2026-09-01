import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";
import {
  ok,
  unauthorized,
  type ActionResult,
} from "@/lib/action-result";

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
  if (!clerkId) {
    console.warn("[auth] Requête sans session Clerk.");
    return unauthorized(DENIED);
  }
  if (sessionClaims?.metadata?.role !== "admin") {
    console.warn("[auth] Utilisateur %s n'est pas admin.", clerkId);
    return unauthorized(DENIED);
  }

  const user = await prisma.user.upsert({
    where: { clerkId },
    update: {},
    create: { clerkId },
  });

  return ok({ id: user.id });
}
