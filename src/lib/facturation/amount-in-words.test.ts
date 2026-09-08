import { describe, expect, it } from "vitest";

import { amountInWords, arreteProformaLine } from "./amount-in-words";

describe("amountInWords", () => {
  it("convertit un montant entier en toutes lettres en français", () => {
    expect(amountInWords(49800000)).toBe(
      "Quarante-neuf millions huit cent mille ariary",
    );
  });

  it("traite les montants simples", () => {
    expect(amountInWords(0)).toBe("Zéro ariary");
    expect(amountInWords(100)).toBe("Cent ariary");
    expect(amountInWords(2000)).toBe("Deux mille ariary");
  });

  it("gère les décimales avec « virgule »", () => {
    expect(amountInWords(1234.56)).toBe(
      "Mille deux cent trente-quatre virgule cinquante-six ariary",
    );
  });

  it("arrondit avant la conversion", () => {
    expect(amountInWords(1000.006)).toBe("Mille virgule zéro un ariary");
    expect(amountInWords(999.999)).toBe("Mille ariary");
  });
});

describe("arreteProformaLine", () => {
  it("encadre le montant en toutes lettres par des astérisques", () => {
    expect(arreteProformaLine(49800000)).toBe(
      "Arrêté la présente facture proforma à la somme de : ***Quarante-neuf millions huit cent mille ariary***.",
    );
  });
});
