import { z } from "zod";

/**
 * Source de vérité du formulaire de proforma : le formulaire, l'aperçu PDF,
 * la préview API et la server action dérivent tous de `proformaSchema`.
 *
 * Les noms de champs suivent la convention snake_case des modèles Prisma pour
 * que la persistance n'ait pas besoin de mapping.
 */

/**
 * Champ texte optionnel : vide ("") ou `null` devient `null` en base.
 * Accepte `null` car le formulaire est validé deux fois : côté client (valeurs
 * brutes) puis côté serveur (payload JSON, où les vides sont déjà `null`).
 */
const optionalText = z
  .union([z.string().trim(), z.null()])
  .transform((value) => (value === null || value === "" ? null : value));

/** Champ texte obligatoire. */
const requiredText = z.string().trim().min(1, "Ce champ est requis");

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
const requiredDate = z
  .preprocess(parseDate, z.date({ errorMap: () => ({ message: "Date invalide" }) }))
  .refine((value) => !Number.isNaN(value.getTime()), "Date invalide");

/** Date optionnelle : vide, `null` ou `undefined` devient `null`. */
const optionalDate = z
  .preprocess(parseDate, z.date().nullable())
  .optional()
  .refine(
    (value) => value == null || !Number.isNaN(value.getTime()),
    "Date invalide",
  );

/** Pourcentage : 0 à 100, avec `""` traité comme 0. */
const percent = z.coerce.number().min(0, "Pourcentage négatif").max(100, "Maximum 100 %");

/** Nombre positif (quantité). */
const positiveNumber = z.coerce.number().positive("Doit être supérieur à 0");

/** Nombre positif ou nul (prix, montants). */
const nonNegativeNumber = z
  .coerce.number()
  .nonnegative("Doit être positif ou nul");

/** Nombre de lignes d'articles réservées par le template. */
export const PROFORMA_MAX_ITEMS = 11;

export const proformaItemSchema = z.object({
  // Identifiant de l'article source (sélection du formulaire) : il sert
  // uniquement à l'auto-remplissage, jamais de clé étrangère.
  article_id: z.coerce.number().int().min(1, "Sélectionnez un article"),
  designation: requiredText,
  max_loading: optionalText,
  pressure: optionalText,
  dimension: optionalText,
  uom: optionalText,
  quantite: positiveNumber,
  prix_unitaire: nonNegativeNumber,
  remise_pct: percent.default(0),
});

export const proformaSchema = z.object({
  pf_num: requiredText,
  date: requiredDate,
  // Copie figée des données client (pas de FK) : le document reste inchangé
  // même si la fiche client source est modifiée ensuite.
  client_id: z.coerce.number().int().min(1, "Sélectionnez un client"),
  client_code: z.coerce.string().trim().min(1, "Code client requis"),
  client_name: requiredText,
  client_address: optionalText,
  client_province: requiredText,
  client_nif: optionalText,
  client_stat: optionalText,
  client_rcs: optionalText,
  client_contact: optionalText,
  client_phone: optionalText,
  client_mail: optionalText,
  // Conditions commerciales.
  votre_reference: optionalText,
  validite_offre: optionalDate,
  terme_paiement: z.coerce.number().int().min(0, "Terme invalide").default(0),
  monnaie: requiredText.default("MGA"),
  // TVA globale : appliquée une fois sur le montant net, pas ligne par ligne.
  tva_active: z.boolean().default(false),
  tva_rate: percent.default(20),
  items: z
    .array(proformaItemSchema)
    .min(1, "Ajoutez au moins un article")
    .max(PROFORMA_MAX_ITEMS, `${PROFORMA_MAX_ITEMS} lignes maximum`),
});

export type ProformaInput = z.infer<typeof proformaSchema>;
export type ProformaItemInput = z.infer<typeof proformaItemSchema>;
