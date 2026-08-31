import { z } from "zod";

/**
 * Source de vérité du formulaire de facture : le formulaire, l'aperçu PDF,
 * la préview API et la server action dérivent tous de `factureSchema`.
 *
 * Les noms de champs suivent la convention snake_case des modèles Prisma pour
 * que la persistance n'ait pas besoin de mapping.
 *
 * Les primitives de validation (optionalText, requiredText, parseDate, etc.)
 * sont partagées avec le schéma proforma via `shared-zod.ts`.
 */

import {
  optionalText,
  requiredText,
  requiredDate,
  optionalDate,
  percent,
  positiveNumber,
  nonNegativeNumber,
} from "./shared-zod";

/** Nombre de lignes d'articles réservées par le template. */
export const FACTURE_MAX_ITEMS = 11;

export const factureItemSchema = z.object({
  // Identifiant de l'article source (sélection du formulaire) : il sert
  // uniquement à l'auto-remplissage, jamais de clé étrangère.
  article_id: z.coerce.number().int().min(1, "Sélectionnez un article"),
  designation: requiredText,
  uom: optionalText,
  quantite: positiveNumber,
  prix_unitaire: nonNegativeNumber,
  remise_pct: percent.default(0),
});

export const factureSchema = z.object({
  facture_num: requiredText,
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
  monnaie: requiredText.default("MGA"),
  // Champs spécifiques à la facture.
  date_paiement: optionalDate,
  livraison: z.string().trim().default(""),
  paiement: z.string().trim().default(""),
  // Référence vers le proforma source (optionnel).
  proforma_id: z.coerce.number().int().optional().nullable(),
  // TVA globale : appliquée une fois sur le montant net, pas ligne par ligne.
  tva_active: z.boolean().default(false),
  tva_rate: percent.default(20),
  items: z
    .array(factureItemSchema)
    .min(1, "Ajoutez au moins un article")
    .max(FACTURE_MAX_ITEMS, `${FACTURE_MAX_ITEMS} lignes maximum`),
});

export type FactureInput = z.infer<typeof factureSchema>;
export type FactureItemInput = z.infer<typeof factureItemSchema>;
