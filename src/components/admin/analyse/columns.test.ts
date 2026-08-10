import { describe, expect, it } from "vitest";

import type { Article } from "@/app/generated/prisma/client";
import { grossMargin } from "@/lib/analyse/margin";

import {
  computeDerived,
  fieldColumns,
  formatFieldValue,
  inputColumns,
  isDerivedColumn,
  type Column,
  type DerivedColumn,
  type FieldColumn,
} from "./column-model";
import { ARTICLE_COLUMNS, CLIENT_COLUMNS } from "./columns";

const TABLES = [
  ["ARTICLE_COLUMNS", ARTICLE_COLUMNS],
  ["CLIENT_COLUMNS", CLIENT_COLUMNS],
] as const;

 /**
 * Les tableaux sont déclarés dans des server components puis passés à
 * `DataTable`, qui est un composant client : une fonction dans ces définitions
 * provoque « Functions cannot be passed directly to Client Components » au
 * rendu de la page.
 *
 * Les types `FieldColumn` / `DerivedColumn` sont la première garde — aucun de
 * leurs champs n'accepte une fonction. Ce test couvre le cas qu'ils ne voient
 * pas : un objet assemblé par spread ou via une variable intermédiaire.
 */
describe.each(TABLES)("%s traverse la frontière serveur/client", (_, columns) => {
  it("survit à une sérialisation JSON", () => {
    expect(JSON.parse(JSON.stringify(columns))).toEqual(columns);
  });
});

/** La colonne d'une clé donnée, typée après vérification de sa présence. */
function fieldColumn<Row>(
  columns: Column<Row>[],
  key: keyof Row,
): FieldColumn<Row> {
  const column = fieldColumns(columns).find(
    (candidate) => candidate.key === key,
  );

  if (!column) {
    throw new Error(`La colonne « ${String(key)} » est absente du tableau.`);
  }
  return column;
}

/**
 * Les clés uniques sont attribuées par le serveur : elles doivent rester hors
 * de la saisie, sinon la ligne d'ajout renverrait une valeur que la server
 * action ignore — ou, pire, un doublon.
 */
describe("clés attribuées automatiquement", () => {
  it("exclut le code client de la saisie, mais l'affiche verrouillé", () => {
    const saisies = inputColumns(fieldColumns(CLIENT_COLUMNS)).map(
      (column) => column.key,
    );

    expect(saisies).not.toContain("code_client");
    expect(fieldColumn(CLIENT_COLUMNS, "code_client")).toMatchObject({
      generated: true,
      readOnly: true,
    });
  });

  it("exclut la référence de la saisie, mais l'affiche verrouillée", () => {
    const saisies = inputColumns(fieldColumns(ARTICLE_COLUMNS)).map(
      (column) => column.key,
    );

    expect(saisies).not.toContain("reference");
    expect(fieldColumn(ARTICLE_COLUMNS, "reference")).toMatchObject({
      generated: true,
      readOnly: true,
    });
  });
});

describe("colonne « Code client »", () => {
  const column = fieldColumn(CLIENT_COLUMNS, "code_client");

  it("affiche le code sur trois chiffres", () => {
    expect(formatFieldValue(column, 1)).toBe("001");
    expect(formatFieldValue(column, 57)).toBe("057");
    expect(formatFieldValue(column, 1000)).toBe("1000");
  });

  /** Une cellule vide reste vide : `ReadOnlyCell` affiche alors un tiret. */
  it("laisse une valeur absente telle quelle", () => {
    expect(formatFieldValue(column, null)).toBeNull();
  });
});

/** La colonne « Marge brute », typée après vérification de sa présence. */
function marginColumn(): DerivedColumn<Article> {
  const column = ARTICLE_COLUMNS.find(
    (candidate) => isDerivedColumn(candidate) && candidate.id === "marge_brute",
  );

  if (!column || !isDerivedColumn(column)) {
    throw new Error("La colonne « marge_brute » est absente d'ARTICLE_COLUMNS.");
  }
  return column;
}

describe("colonne « Marge brute »", () => {
  it("calcule une différence entre deux champs de la ligne", () => {
    const column = marginColumn();

    expect(column.operation).toBe("difference");
    expect(column.from).toBe("prix_vente_ttc");
    expect(column.subtract).toBe("prix_achat_ttc");
  });

  it("soustrait le prix d'achat du prix de vente", () => {
    const article = { prix_vente_ttc: 150.5, prix_achat_ttc: 100.2 } as Article;

    expect(computeDerived(marginColumn(), article)).toBe(50.3);
  });

  it("laisse la marge inconnue quand un prix manque", () => {
    const article = { prix_vente_ttc: null, prix_achat_ttc: 200 } as Article;

    expect(computeDerived(marginColumn(), article)).toBeNull();
  });

  /**
   * La colonne du tableau et le graphique de rentabilité calculent la marge
   * séparément — la colonne de façon déclarative, le graphique via
   * {@link grossMargin}. Sans cette équivalence, modifier la règle d'un seul
   * côté afficherait deux montants différents pour le même article.
   */
  it("calcule la même marge que le graphique de rentabilité", () => {
    const articles = [
      { prix_vente_ttc: 150.5, prix_achat_ttc: 100.2 },
      { prix_vente_ttc: 60, prix_achat_ttc: 100 },
      { prix_vente_ttc: 80, prix_achat_ttc: 0 },
      { prix_vente_ttc: null, prix_achat_ttc: 200 },
      { prix_vente_ttc: 200, prix_achat_ttc: null },
    ] as Article[];

    for (const article of articles) {
      expect(computeDerived(marginColumn(), article)).toBe(grossMargin(article));
    }
  });
});
