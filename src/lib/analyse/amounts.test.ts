import { describe, expect, it } from "vitest";

import { subtractAmounts } from "./amounts";

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
    expect(subtractAmounts(undefined, undefined)).toBeNull();
  });

  it("renvoie null quand un montant est vide ou non numérique", () => {
    expect(subtractAmounts("", 100)).toBeNull();
    expect(subtractAmounts("abc", 100)).toBeNull();
  });

  it("distingue une différence nulle d'une différence inconnue", () => {
    expect(subtractAmounts(100, 100)).toBe(0);
  });
});
