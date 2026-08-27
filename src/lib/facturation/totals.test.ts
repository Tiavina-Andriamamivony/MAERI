import { describe, expect, it } from "vitest";

import type { ProformaItemInput } from "@/lib/validations/proforma";

import { lineTotals, proformaTotals } from "./totals";

function item(overrides: Partial<ProformaItemInput> = {}): ProformaItemInput {
  return {
    article_id: 1,
    designation: "Article test",
    uom: "PC",
    quantite: 1,
    prix_unitaire: 1000,
    remise_pct: 0,
    ...overrides,
  };
}

describe("lineTotals", () => {
  it("calcule le montant brut à partir de la quantité et du prix", () => {
    expect(lineTotals(item({ quantite: 4, prix_unitaire: 12_450_000 }))).toEqual({
      brut: 49_800_000,
      remise: 0,
      net: 49_800_000,
    });
  });

  it("applique la remise en pourcentage sur le brut", () => {
    expect(lineTotals(item({ quantite: 10, prix_unitaire: 1000, remise_pct: 5 }))).toEqual({
      brut: 10_000,
      remise: 500,
      net: 9_500,
    });
  });

  it("arrondit les montants à deux décimales", () => {
    expect(lineTotals(item({ quantite: 3, prix_unitaire: 333.33 }))).toEqual({
      brut: 999.99,
      remise: 0,
      net: 999.99,
    });
  });

  it("une remise à 100 % annule le montant net", () => {
    expect(lineTotals(item({ quantite: 2, prix_unitaire: 5000, remise_pct: 100 }))).toEqual({
      brut: 10_000,
      remise: 10_000,
      net: 0,
    });
  });
});

describe("proformaTotals", () => {
  it("totalise les lignes sans TVA", () => {
    const totals = proformaTotals(
      [
        item({ quantite: 4, prix_unitaire: 12_450_000 }),
        item({ quantite: 2, prix_unitaire: 5_000 }),
      ],
      false,
      20,
    );

    expect(totals.sous_total).toBe(49_810_000);
    expect(totals.remise).toBe(0);
    expect(totals.remise_pct).toBe(0);
    expect(totals.montant_net).toBe(49_810_000);
    expect(totals.montant_tva).toBe(0);
    expect(totals.montant_total).toBe(49_810_000);
  });

  it("déduit les remises des lignes du montant net", () => {
    const totals = proformaTotals(
      [item({ quantite: 10, prix_unitaire: 1_000, remise_pct: 10 })],
      false,
      20,
    );

    expect(totals.sous_total).toBe(10_000);
    expect(totals.remise).toBe(1_000);
    expect(totals.remise_pct).toBe(10);
    expect(totals.montant_net).toBe(9_000);
    expect(totals.montant_total).toBe(9_000);
  });

  it("applique la TVA globale sur le montant net", () => {
    const totals = proformaTotals(
      [item({ quantite: 10, prix_unitaire: 1_000 })],
      true,
      20,
    );

    expect(totals.montant_net).toBe(10_000);
    expect(totals.montant_tva).toBe(2_000);
    expect(totals.montant_total).toBe(12_000);
  });

  it("ne calcule aucune TVA quand elle est désactivée", () => {
    const totals = proformaTotals(
      [item({ quantite: 1, prix_unitaire: 1_000 })],
      false,
      20,
    );

    expect(totals.montant_tva).toBe(0);
    expect(totals.montant_total).toBe(totals.montant_net);
  });

  it("la chaîne sous-total − remise = net reste exacte à l'arrondi près", () => {
    const totals = proformaTotals(
      [item({ quantite: 3, prix_unitaire: 10_000, remise_pct: 5 })],
      false,
      20,
    );

    expect(totals.sous_total - totals.remise).toBe(totals.montant_net);
    expect(totals.remise_pct).toBeCloseTo(5, 2);
  });

  it("une liste vide produit des totaux nuls", () => {
    const totals = proformaTotals([], true, 20);

    expect(totals).toEqual({
      sous_total: 0,
      remise: 0,
      remise_pct: 0,
      montant_net: 0,
      montant_tva: 0,
      montant_total: 0,
    });
  });
});
