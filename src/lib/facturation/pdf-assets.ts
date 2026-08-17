/**
 * Contenus fixes du proforma, alignés sur le template Excel
 * (`public/2026 template.xlsx`, feuille « proforma »).
 */

export const COMPANY = {
  name: "MA-ERI Consulting",
  addressLines: [
    "Lot Z 0750 Ambodisaina Ivondro",
    "Toamasina 501 - MADAGASCAR",
    "TEL:  +261 32 07 079 97",
    "         +261 34 06 002 70",
    "contact-maeri@telma.net",
    "maeri.consulting.2024@gmail.com",
    "",
    "NIF : 4012745546",
    "STAT : 68101 31 2024 0 00325",
    "RCS Toamasina 2024 A 00087",
    "CIF:0120073/DGI-M du 11/04/25",
  ],
} as const;

export const BANK = {
  title: "Coordonné Bancaire (RIB) : BRED MADAGASIKARA Banque Populaire",
  address: "AVENUE DE L'INDEPENDANCE - TOAMASINA 501-MADAGASCAR",
  rib: "00008 00490 05003022604 03",
} as const;

export const LEGAL_NOTICE =
  "Les marchandises restent la propriété de MA-ERI CONSULTING jusqu'à leur paiement intégral.\nTout retard de paiement entraînera l'application d'une pénalité de 8% par mois de retard.";

/**
 * Nombre de lignes d'articles réservées par le template : le bloc des totaux
 * reste ainsi à position fixe sous le tableau, même avec peu d'articles.
 */
export const TABLE_ROW_COUNT = 11;

/** Taux de TVA proposé par défaut dans le formulaire. */
export const DEFAULT_TVA_RATE = 20;

/** Monnaie proposée par défaut. */
export const DEFAULT_CURRENCY = "MGA";
