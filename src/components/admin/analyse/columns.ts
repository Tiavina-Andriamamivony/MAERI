import type { Article, Client } from "@/app/generated/prisma/client";

import type { Column } from "./column-model";

/**
 * Définition unique des colonnes des tableaux Clients / Articles : `key`
 * (champ Prisma) + `label` (en-tête affiché). Partagée entre l'affichage
 * ({@link DataTable}) et l'export Excel, pour éviter toute divergence.
 *
 * Les libellés sont choisis pour correspondre, une fois mis en majuscules, aux
 * en-têtes reconnus à l'import (`HEADER_TO_FIELD`). Un fichier exporté est donc
 * directement réimportable — la colonne calculée « Marge brute » ne figure dans
 * aucun `HEADER_TO_FIELD` et est donc ignorée à la relecture, ce qui est voulu.
 */
export const ARTICLE_COLUMNS: Column<Article>[] = [
  { key: "reference", label: "Référence", readOnly: true, generated: true },
  { key: "designation", label: "Désignation" },
  { key: "categorie", label: "Catégorie" },
  { key: "uom", label: "UOM" },
  { key: "prix_achat_ttc", label: "Prix d'achat TTC", type: "number" },
  { key: "prix_vente_ttc", label: "Prix de vente TTC", type: "number" },
  {
    id: "marge_brute",
    label: "Marge brute",
    operation: "difference",
    from: "prix_vente_ttc",
    subtract: "prix_achat_ttc",
  },
];

export const CLIENT_COLUMNS: Column<Client>[] = [
  {
    key: "code_client",
    label: "Code client",
    readOnly: true,
    generated: true,
    format: "clientCode",
  },
  { key: "client", label: "Client" },
  { key: "adress", label: "Adresse" },
  { key: "province", label: "Province" },
  { key: "nif", label: "NIF", type: "number" },
  { key: "stat", label: "STAT", type: "number" },
  { key: "rcs", label: "RCS" },
  { key: "cf", label: "CF" },
  { key: "contact", label: "Contact" },
  { key: "phone", label: "Téléphone" },
  { key: "mail", label: "Mail" },
];
