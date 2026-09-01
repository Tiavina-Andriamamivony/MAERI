import { z } from "zod";

import {
  optionalText,
  requiredText,
  requiredDate,
  optionalDate,
  percent,
  itemSchema,
  type ItemInput,
} from "./shared-zod";

/** Nombre de lignes d'articles réservées par le template. */
export const FACTURE_MAX_ITEMS = 11;

export const factureItemSchema = itemSchema;

export const factureSchema = z.object({
  facture_num: requiredText,
  date: requiredDate,
  client_id: z.coerce.number().int().min(1, "Sélectionnez un client"),
  // Conditions commerciales.
  votre_reference: optionalText,
  monnaie: requiredText.default("MGA"),
  date_paiement: optionalDate,
  livraison: z.string().trim().default(""),
  paiement: z.string().trim().default(""),
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
export type FactureItemInput = ItemInput;
