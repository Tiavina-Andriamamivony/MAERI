import { z } from "zod";

/** Champ texte optionnel : un champ vidé ("") devient `null` en base. */
const optionalText = z
  .string()
  .trim()
  .transform((value) => (value === "" ? null : value));

/** Champ nombre optionnel : "" devient `null`, sinon un nombre valide. */
const optionalNumber = z
  .string()
  .trim()
  .transform((value) => (value === "" ? null : Number(value)))
  .refine((value) => value === null || !Number.isNaN(value), "Nombre invalide");

/** Champ texte obligatoire. */
const requiredText = z.string().trim().min(1, "Ce champ est requis");

/** Champ nombre obligatoire. */
const requiredNumber = z
  .string()
  .trim()
  .min(1, "Ce champ est requis")
  .transform((value) => Number(value))
  .refine((value) => !Number.isNaN(value), "Nombre invalide");

/** Identifiant de ligne (transmis en champ caché lors d'une modification). */
const rowId = z.coerce.number().int().positive();

// Champs modifiables d'un article (hors clé `reference` et `id`).
const articleFields = {
  designation: optionalText,
  categorie: optionalText,
  uom: optionalText,
  prix_achat_ttc: optionalNumber,
  prix_vente_ttc: optionalNumber,
};

export const createArticleSchema = z.object({
  reference: requiredText,
  ...articleFields,
});

export const updateArticleSchema = z.object({
  id: rowId,
  ...articleFields,
});

// Champs modifiables d'un client (hors clé `code_client` et `id`).
const clientFields = {
  client: requiredText,
  province: requiredText,
  adress: optionalText,
  nif: optionalNumber,
  stat: optionalNumber,
  rcs: optionalText,
  cf: optionalText,
  contact: optionalText,
  phone: optionalText,
  mail: optionalText,
};

export const createClientSchema = z.object({
  code_client: requiredNumber,
  ...clientFields,
});

export const updateClientSchema = z.object({
  id: rowId,
  ...clientFields,
});
