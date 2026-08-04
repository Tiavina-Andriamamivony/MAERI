import { describe, expect, it } from "vitest";

import { grossMargin, marginRateOnCost, rankByMarginRate } from "./margin";

/** Article réduit aux champs que le classement lit réellement. */
function article(
  fields: Partial<{
    reference: string;
    designation: string | null;
    prix_achat_ttc: number | null;
    prix_vente_ttc: number | null;
  }> = {},
) {
  return {
    reference: "REF",
    designation: "Article",
    prix_achat_ttc: 100,
    prix_vente_ttc: 150,
    ...fields,
  };
}

describe("grossMargin", () => {
  it("soustrait le prix d'achat du prix de vente", () => {
    expect(grossMargin(article())).toBe(50);
  });

  it("arrondit au centime", () => {
    expect(
      grossMargin(article({ prix_achat_ttc: 100.2, prix_vente_ttc: 150.5 })),
    ).toBe(50.3);
  });

  it("renvoie une marge négative pour un article vendu à perte", () => {
    expect(
      grossMargin(article({ prix_achat_ttc: 150, prix_vente_ttc: 100 })),
    ).toBe(-50);
  });

  it("renvoie null quand un prix manque", () => {
    expect(grossMargin(article({ prix_vente_ttc: null }))).toBeNull();
    expect(grossMargin(article({ prix_achat_ttc: null }))).toBeNull();
  });
});

describe("marginRateOnCost", () => {
  it("rapporte la marge au prix d'achat, et non au prix de vente", () => {
    // 50 de marge sur 100 d'achat = 50 % (et non 33,3 % de 150 de vente).
    expect(marginRateOnCost(article(), 50)).toBe(50);
  });

  it("dépasse 100 % quand la marge excède le prix d'achat", () => {
    expect(
      marginRateOnCost(article({ prix_achat_ttc: 40, prix_vente_ttc: 140 }), 100),
    ).toBe(250);
  });

  it("renvoie null quand le prix d'achat est nul", () => {
    expect(marginRateOnCost(article({ prix_achat_ttc: 0 }), 150)).toBeNull();
  });
});

describe("rankByMarginRate", () => {
  it("classe les articles du plus fort au plus faible taux de marge", () => {
    const ranking = rankByMarginRate([
      article({ designation: "Faible", prix_achat_ttc: 100, prix_vente_ttc: 110 }),
      article({ designation: "Fort", prix_achat_ttc: 100, prix_vente_ttc: 300 }),
      article({ designation: "Moyen", prix_achat_ttc: 100, prix_vente_ttc: 180 }),
    ]);

    expect(ranking.ranked.map((entry) => entry.designation)).toEqual([
      "Fort",
      "Moyen",
      "Faible",
    ]);
    expect(ranking.ranked.map((entry) => entry.marginRateOnCost)).toEqual([
      200, 80, 10,
    ]);
  });

  it("classe au taux, pas à la marge en ariary", () => {
    // 5 000 Ar de marge sur 5 000 d'achat (100 %) bat 10 000 Ar sur 100 000
    // d'achat (10 %) : l'article bon marché est le plus rentable.
    const ranking = rankByMarginRate([
      article({
        designation: "Grosse marge",
        prix_achat_ttc: 100_000,
        prix_vente_ttc: 110_000,
      }),
      article({
        designation: "Fort taux",
        prix_achat_ttc: 5_000,
        prix_vente_ttc: 10_000,
      }),
    ]);

    expect(ranking.ranked.map((entry) => entry.designation)).toEqual([
      "Fort taux",
      "Grosse marge",
    ]);
    expect(ranking.ranked[0].margin).toBe(5_000);
  });

  it("place les articles vendus à perte en fin de classement", () => {
    const ranking = rankByMarginRate([
      article({ designation: "Perte", prix_achat_ttc: 100, prix_vente_ttc: 60 }),
      article({ designation: "Gain", prix_achat_ttc: 100, prix_vente_ttc: 120 }),
    ]);

    expect(ranking.ranked.map((entry) => entry.designation)).toEqual([
      "Gain",
      "Perte",
    ]);
    expect(ranking.ranked[1].marginRateOnCost).toBe(-40);
  });

  it("écarte les articles sans prix complet et les compte", () => {
    const ranking = rankByMarginRate([
      article({ designation: "Complet" }),
      article({ designation: "Sans vente", prix_vente_ttc: null }),
      article({ designation: "Sans achat", prix_achat_ttc: null }),
    ]);

    expect(ranking.ranked.map((entry) => entry.designation)).toEqual([
      "Complet",
    ]);
    expect(ranking.excludedCount).toBe(2);
  });

  it("écarte les articles au prix d'achat nul, dont le taux n'existe pas", () => {
    const ranking = rankByMarginRate([
      article({ designation: "Classable" }),
      article({ designation: "Achat nul", prix_achat_ttc: 0, prix_vente_ttc: 80 }),
    ]);

    expect(ranking.ranked.map((entry) => entry.designation)).toEqual([
      "Classable",
    ]);
    expect(ranking.excludedCount).toBe(1);
  });

  it("n'écarte rien quand tous les prix sont exploitables", () => {
    const ranking = rankByMarginRate([article(), article()]);

    expect(ranking.ranked).toHaveLength(2);
    expect(ranking.excludedCount).toBe(0);
  });

  it("retombe sur la référence quand la désignation est absente", () => {
    const ranking = rankByMarginRate([
      article({ designation: null, reference: "ROUL-6204" }),
    ]);

    expect(ranking.ranked[0].designation).toBe("ROUL-6204");
  });

  it("expose la marge en ariary de chaque article classé", () => {
    const ranking = rankByMarginRate([
      article({ prix_achat_ttc: 200, prix_vente_ttc: 250 }),
    ]);

    expect(ranking.ranked[0].margin).toBe(50);
    expect(ranking.ranked[0].marginRateOnCost).toBe(25);
  });

  it("renvoie un classement vide sans article", () => {
    expect(rankByMarginRate([])).toEqual({ ranked: [], excludedCount: 0 });
  });
});
