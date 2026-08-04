import { describe, expect, it } from "vitest";

import { percentageOf, subtractAmounts } from "./amounts";

describe("subtractAmounts", () => {
  it("soustrait le second montant du premier", () => {
    expect(subtractAmounts(150, 100)).toBe(50);
  });

  it("arrondit au centime les artefacts de la soustraction flottante", () => {
    expect(subtractAmounts(150.5, 100.2)).toBe(50.3);
  });

  it("renvoie une différence négative quand le premier montant est le plus petit", () => {
    expect(subtractAmounts(100, 150)).toBe(-50);
  });

  it("accepte les montants transmis sous forme de texte", () => {
    expect(subtractAmounts("150", "100")).toBe(50);
  });

  it("renvoie null quand un montant est absent", () => {
    expect(subtractAmounts(null, 100)).toBeNull();
    expect(subtractAmounts(150, null)).toBeNull();
    expect(subtractAmounts(undefined, 100)).toBeNull();
  });

  it("renvoie null quand un montant est vide ou non numérique", () => {
    expect(subtractAmounts("", 100)).toBeNull();
    expect(subtractAmounts("abc", 100)).toBeNull();
  });

  it("distingue une différence nulle d'une différence inconnue", () => {
    expect(subtractAmounts(100, 100)).toBe(0);
  });
});

describe("percentageOf", () => {
  it("exprime un montant en pourcentage d'un autre", () => {
    expect(percentageOf(50, 100)).toBe(50);
    expect(percentageOf(150, 100)).toBe(150);
  });

  it("arrondit au dixième de pourcent", () => {
    expect(percentageOf(50.3, 100.2)).toBe(50.2);
    expect(percentageOf(1, 3)).toBe(33.3);
  });

  it("accepte une part négative", () => {
    expect(percentageOf(-25, 100)).toBe(-25);
  });

  it("renvoie null quand la base est nulle", () => {
    expect(percentageOf(50, 0)).toBeNull();
  });

  it("renvoie null quand un montant est absent ou non numérique", () => {
    expect(percentageOf(null, 100)).toBeNull();
    expect(percentageOf(50, null)).toBeNull();
    expect(percentageOf("abc", 100)).toBeNull();
  });

  it("distingue une part nulle d'une part inconnue", () => {
    expect(percentageOf(0, 100)).toBe(0);
  });
});
