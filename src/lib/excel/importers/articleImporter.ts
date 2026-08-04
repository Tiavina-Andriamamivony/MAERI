import prisma from "@/lib/prisma";
import type { SheetImporter } from "../importSheet";
import { toDecimal, toOptionalText } from "../converters";

type ArticleField =
  | "reference" | "designation" | "categorie" | "uom"
  | "prix_achat_ttc" | "prix_vente_ttc";

const HEADER_TO_FIELD: Record<string, ArticleField> = {
  REFERENCE: "reference",
  RÉFÉRENCE: "reference",
  DESIGNATION: "designation",
  DÉSIGNATION: "designation",
  CATEGORIE: "categorie",
  CATÉGORIE: "categorie",
  UOM: "uom",
  "PRIX D'ACHAT TTC": "prix_achat_ttc",
  "PRIX DE VENTE TTC": "prix_vente_ttc",
};

type ArticleData = {
  reference: string;
  designation: string | null;
  categorie: string | null;
  uom: string | null;
  prix_achat_ttc: number | null;
  prix_vente_ttc: number | null;
};

export const articleImporter: SheetImporter<ArticleField, ArticleData> = {
  headerToField: HEADER_TO_FIELD,

  parseRow(fields) {
    const reference = toOptionalText(fields.reference);
    if (reference === null) {
      return { valid: false, error: "référence manquante" };
    }
    return {
      valid: true,
      key: reference,
      keyLabel: `référence ${reference}`,
      data: {
        reference,
        designation: toOptionalText(fields.designation),
        categorie: toOptionalText(fields.categorie),
        uom: toOptionalText(fields.uom),
        prix_achat_ttc: toDecimal(fields.prix_achat_ttc),
        prix_vente_ttc: toDecimal(fields.prix_vente_ttc),
      },
    };
  },

  async loadExistingKeys() {
    const articles = await prisma.article.findMany({ select: { reference: true } });
    return new Set(articles.map((article) => article.reference));
  },

  async save(_key, data) {
    await prisma.article.upsert({
      where: { reference: data.reference },
      update: data,
      create: data,
    });
  },
};
