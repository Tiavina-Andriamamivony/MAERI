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
  /** Marge rapportée au prix d'achat, en %. */
  marginRateOnCost: number;
};

export type MarginRanking = {
  /** Articles classés par taux de marge décroissant. */
  ranked: ArticleMargin[];
  /** Articles écartés : prix manquant, ou prix d'achat nul. */
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
 * Classe les articles du plus rentable au moins rentable, au **taux de marge**.
 *
 * Le critère est le taux, pas la marge en ariary : un article bon marché qui
 * double de prix est plus rentable qu'un article coûteux dont la marge absolue
 * est plus grosse. Sans cela, le classement ne montrerait que les articles
 * chers.
 *
 * Un article dont le taux est inconnu — l'un des deux prix manque, ou le prix
 * d'achat est nul — n'a pas sa place dans ce classement : il est écarté, mais
 * compté pour que l'écran puisse le signaler plutôt que de le passer sous
 * silence.
 */
export function rankByMarginRate(articles: PricedArticle[]): MarginRanking {
  const ranked: ArticleMargin[] = [];

  for (const article of articles) {
    const margin = grossMargin(article);
    if (margin === null) continue;

    const rate = marginRateOnCost(article, margin);
    if (rate === null) continue;

    ranked.push({
      designation: article.designation ?? article.reference,
      margin,
      marginRateOnCost: rate,
    });
  }

  ranked.sort((left, right) => right.marginRateOnCost - left.marginRateOnCost);

  return { ranked, excludedCount: articles.length - ranked.length };
}
