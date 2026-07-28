import { describe, expect, it } from "vitest";

import { computeDerived, isDerivedColumn } from "./column-model";
import { ARTICLE_COLUMNS, CLIENT_COLUMNS } from "./columns";

const TABLES = [
  ["ARTICLE_COLUMNS", ARTICLE_COLUMNS],
  ["CLIENT_COLUMNS", CLIENT_COLUMNS],
] as const;

/**
 * Les tableaux sont déclarés dans des server components puis passés à
 * `DataTable`, qui est un composant client : une fonction dans ces définitions
 * provoque « Functions cannot be passed directly to Client Components » au
 * rendu de la page. Ces deux tests ferment cette régression.
 */
describe.each(TABLES)("%s traverse la frontière serveur/client", (_, columns) => {
  it("ne contient aucune fonction", () => {
    for (const column of columns) {
      for (const [property, value] of Object.entries(column)) {
        expect(typeof value, `${column.label}.${property}`).not.toBe("function");
      }
    }
  });

  it("survit à une sérialisation JSON", () => {
    expect(JSON.parse(JSON.stringify(columns))).toEqual(columns);
  });
});

describe("colonne « Marge brute »", () => {
  const margin = ARTICLE_COLUMNS.find(
    (column) => isDerivedColumn(column) && column.id === "marge_brute",
  );

  it("est déclarée comme colonne calculée", () => {
    expect(margin).toBeDefined();
    expect(margin && isDerivedColumn(margin)).toBe(true);
  });

  it("est placée juste après les deux prix", () => {
    expect(ARTICLE_COLUMNS.map((column) => column.label).slice(-3)).toEqual([
      "Prix d'achat TTC",
      "Prix de vente TTC",
      "Marge brute",
    ]);
  });

  it("soustrait le prix d'achat du prix de vente", () => {
    if (!margin || !isDerivedColumn(margin)) throw new Error("colonne absente");

    const prices: Record<string, unknown> = {
      prix_achat_ttc: 100.2,
      prix_vente_ttc: 150.5,
    };
    expect(computeDerived(margin, (key) => prices[String(key)])).toBe(50.3);
  });

  it("laisse la marge inconnue quand un prix manque", () => {
    if (!margin || !isDerivedColumn(margin)) throw new Error("colonne absente");

    const prices: Record<string, unknown> = {
      prix_achat_ttc: 200,
      prix_vente_ttc: null,
    };
    expect(computeDerived(margin, (key) => prices[String(key)])).toBeNull();
  });
});
