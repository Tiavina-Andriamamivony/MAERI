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
export const PROFORMA_MAX_ITEMS = 11;

export const proformaItemSchema = itemSchema;

export const proformaSchema = z.object({
  pf_num: requiredText,
  date: requiredDate,
  client_id: z.coerce.number().int().min(1, "Sélectionnez un client"),
  // Conditions commerciales.
  votre_reference: optionalText,
  validite_offre: optionalDate,
  terme_paiement: z.coerce.number().int().min(0, "Terme invalide").default(0),
  monnaie: requiredText.default("MGA"),
  cif: z.string().trim().default(""),
  delai_livraison: z.string().trim().default(""),
  conditions_paiement: z.string().trim().default(""),
  // TVA globale : appliquée une fois sur le montant net, pas ligne par ligne.
  tva_active: z.boolean().default(false),
  tva_rate: percent.default(20),
  items: z
    .array(proformaItemSchema)
    .min(1, "Ajoutez au moins un article")
    .max(PROFORMA_MAX_ITEMS, `${PROFORMA_MAX_ITEMS} lignes maximum`),
});

export type ProformaInput = z.infer<typeof proformaSchema>;
export type ProformaItemInput = ItemInput;
