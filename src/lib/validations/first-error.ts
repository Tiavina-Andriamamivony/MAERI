import type { z } from "zod";

/** Premier message d'erreur d'une validation zod, ou un message par défaut. */
export function firstError(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Données invalides";
}
