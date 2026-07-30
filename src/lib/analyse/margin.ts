import type { Article } from "@/app/generated/prisma/client";

import { percentageOf, subtractAmounts } from "./amounts";

/** Les seuls champs d'un article nécessaires au calcul de sa rentabilité. */
type PricedArticle = Pick<
  Article,
  "reference" | "designation" | "prix_achat_ttc" | "prix_vente_ttc"
>;

export type ArticleMargin = {
  /** Libellé affiché : la désignation, ou la référence à défaut. */
  designation: string;
  /** Marge brute en ariary. */
  margin: number;
  /** Marge rapportée au prix d'achat, en % (null si prix d'achat nul). */
  marginRateOnCost: number | null;
};

export type MarginRanking = {
  /** Articles classés par marge décroissante. */
  ranked: ArticleMargin[];
  /** Articles écartés faute d'un des deux prix. */
  excludedCount: number;
};

/**
 * Marge brute d'un article : prix de vente TTC − prix d'achat TTC.
 *
 * Règle de référence, partagée par le graphique de rentabilité et la colonne
 * calculée `marge_brute` d'`ARTICLE_COLUMNS` (dont l'équivalence est vérifiée
 * dans `columns.test.ts`).
 */
export function grossMargin(article: PricedArticle): number | null {
  return subtractAmounts(article.prix_vente_ttc, article.prix_achat_ttc);
}

/**
 * Part que la marge représente du prix d'achat, en pourcentage.
 *
 * C'est le **taux de marge** : il rapporte la marge au prix d'achat. Ne pas le
 * confondre avec le taux de marque, qui la rapporte au prix de vente.
 */
export function marginRateOnCost(
  article: PricedArticle,
  margin: number,
): number | null {
  return percentageOf(margin, article.prix_achat_ttc);
}

/**
 * Classe les articles du plus rentable au moins rentable.
 *
 * Un article dont la marge est inconnue (l'un des deux prix manque) n'a pas sa
 * place dans un classement de rentabilité : il est écarté, mais compté pour
 * que l'écran puisse le signaler plutôt que de le passer sous silence.
 */
export function rankByMargin(articles: PricedArticle[]): MarginRanking {
  const ranked: ArticleMargin[] = [];

  for (const article of articles) {
    const margin = grossMargin(article);
    if (margin === null) continue;

    ranked.push({
      designation: article.designation ?? article.reference,
      margin,
      marginRateOnCost: marginRateOnCost(article, margin),
    });
  }

  ranked.sort((left, right) => right.margin - left.margin);

  return { ranked, excludedCount: articles.length - ranked.length };
}
