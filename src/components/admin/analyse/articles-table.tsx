import type { Article } from "@/app/generated/prisma/client";
import {
  createArticle,
  deleteArticle,
  updateArticle,
} from "@/app/actions/articleActions";

import DataTable, { type Column } from "./data-table";

const COLUMNS: Column<Article>[] = [
  { key: "reference", label: "Référence", readOnly: true },
  { key: "designation", label: "Désignation" },
  { key: "categorie", label: "Catégorie" },
  { key: "uom", label: "UOM" },
  { key: "prix_achat_ttc", label: "Prix d'achat TTC", type: "number" },
  { key: "prix_vente_ttc", label: "Prix de vente TTC", type: "number" },
];

export default function ArticlesTable({ articles }: { articles: Article[] }) {
  return (
    <DataTable
      columns={COLUMNS}
      rows={articles}
      emptyMessage="Aucun article importé pour le moment."
      onSave={updateArticle}
      onCreate={createArticle}
      onDelete={deleteArticle}
      labelKey="reference"
    />
  );
}
