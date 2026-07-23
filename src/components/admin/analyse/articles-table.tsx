import type { Article } from "@/app/generated/prisma/client";
import {
  createArticle,
  deleteArticle,
  updateArticle,
} from "@/app/actions/articleActions";

import DataTable from "./data-table";
import { ARTICLE_COLUMNS } from "./columns";

export default function ArticlesTable({ articles }: { articles: Article[] }) {
  return (
    <DataTable
      columns={ARTICLE_COLUMNS}
      rows={articles}
      emptyMessage="Aucun article importé pour le moment."
      actions={{
        update: updateArticle,
        create: createArticle,
        delete: deleteArticle,
        labelKey: "reference",
      }}
    />
  );
}
