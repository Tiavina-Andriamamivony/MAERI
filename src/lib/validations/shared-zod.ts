import { z } from "zod";

/**
 * Primitives de validation zod partagées entre proforma et facture.
 * Évite la duplication des schémas de base (texte, date, nombre).
 */

/**
 * Champ texte optionnel : vide ("") ou `null` devient `null` en base.
 * Accepte `null` car le formulaire est validé deux fois : côté client (valeurs
 * brutes) puis côté serveur (payload JSON, où les vides sont déjà `null`).
 */
export const optionalText = z
  .union([z.string().trim(), z.null()])
  .transform((value) => (value === null || value === "" ? null : value));

/** Champ texte obligatoire. */
export const requiredText = z.string().trim().min(1, "Ce champ est requis");

/**
 * Parse une date en heure locale : « aaaa-mm-jj » (input date) ne doit pas
 * devenir minuit UTC (décalage de jour possible selon le fuseau), d'où une
 * construction par composantes. `null` pour une valeur vide ou non datable.
 */
function parseDate(value: unknown): Date | null {
  if (typeof value !== "string") return value instanceof Date ? value : null;
  if (value.trim() === "") return null;
  const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return parts
    ? new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]))
    : new Date(value);
}

/** Date obligatoire, rejetée si elle est invalide ou vide. */
export const requiredDate = z
  .preprocess(
    parseDate,
    z.date({ errorMap: () => ({ message: "Date invalide" }) }),
  )
  .refine((value) => !Number.isNaN(value.getTime()), "Date invalide");

/** Date optionnelle : vide, `null` ou `undefined` devient `null`. */
export const optionalDate = z
  .preprocess(parseDate, z.date().nullable())
  .optional()
  .refine(
    (value) => value == null || !Number.isNaN(value.getTime()),
    "Date invalide",
  );

/** Pourcentage : 0 à 100, avec `""` traité comme 0. */
export const percent = z
  .coerce.number()
  .min(0, "Pourcentage négatif")
  .max(100, "Maximum 100 %");

/** Nombre positif (quantité). */
export const positiveNumber = z.coerce.number().positive("Doit être supérieur à 0");

/** Nombre positif ou nul (prix, montants). */
export const nonNegativeNumber = z
  .coerce.number()
  .nonnegative("Doit être positif ou nul");
