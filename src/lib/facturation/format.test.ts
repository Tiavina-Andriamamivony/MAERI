import { describe, expect, it } from "vitest";

import {
  formatAmount,
  formatDate,
  formatPercent,
  formatQuantity,
  toDateInputValue,
} from "./format";

describe("formatAmount", () => {
  it("sépare les milliers par une espace et la décimale par une virgule", () => {
    expect(formatAmount(49800000)).toBe("49 800 000,00");
    expect(formatAmount(1234.5)).toBe("1 234,50");
  });

  it("affiche deux décimales", () => {
    expect(formatAmount(0)).toBe("0,00");
    expect(formatAmount(1)).toBe("1,00");
  });
});

describe("formatQuantity", () => {
  it("omet les décimales superflues", () => {
    expect(formatQuantity(4)).toBe("4");
    expect(formatQuantity(2.5)).toBe("2,5");
    expect(formatQuantity(1.25)).toBe("1,25");
  });
});

describe("formatPercent", () => {
  it("formate avec deux décimales et un signe pour cent", () => {
    expect(formatPercent(20)).toBe("20,00 %");
    expect(formatPercent(0)).toBe("0,00 %");
    expect(formatPercent(5.5)).toBe("5,50 %");
  });
});

describe("formatDate", () => {
  it("formate au format jj/mm/aaaa", () => {
    expect(formatDate(new Date(2026, 7, 17))).toBe("17/08/2026");
  });

  it("accepte une chaîne ISO", () => {
    expect(formatDate("2026-08-17")).toBe("17/08/2026");
  });

  it("renvoie une chaîne vide pour une valeur absente", () => {
    expect(formatDate(null)).toBe("");
    expect(formatDate(undefined)).toBe("");
    expect(formatDate("")).toBe("");
  });
});

describe("toDateInputValue", () => {
  it("formate au format aaaa-mm-jj attendu par un input date", () => {
    expect(toDateInputValue(new Date(2026, 7, 17))).toBe("2026-08-17");
  });
});
