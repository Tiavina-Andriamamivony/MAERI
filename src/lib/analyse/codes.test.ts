import { describe, expect, it } from "vitest";

import {
  articleSequenceOf,
  formatArticleReference,
  formatClientCode,
} from "./codes";

describe("formatClientCode", () => {
  it("complète sur trois chiffres", () => {
    expect(formatClientCode(1)).toBe("001");
    expect(formatClientCode(10)).toBe("010");
    expect(formatClientCode(57)).toBe("057");
    expect(formatClientCode(100)).toBe("100");
  });

  /** Au-delà de 999 le code s'élargit : il ne doit jamais être tronqué. */
  it("laisse intacts les codes de plus de trois chiffres", () => {
    expect(formatClientCode(1000)).toBe("1000");
    expect(formatClientCode(12345)).toBe("12345");
  });
});

describe("formatArticleReference", () => {
  it("préfixe et complète sur quatre chiffres", () => {
    expect(formatArticleReference(1)).toBe("ART-0001");
    expect(formatArticleReference(2)).toBe("ART-0002");
    expect(formatArticleReference(42)).toBe("ART-0042");
    expect(formatArticleReference(1234)).toBe("ART-1234");
  });

  it("laisse intactes les séquences de plus de quatre chiffres", () => {
    expect(formatArticleReference(10000)).toBe("ART-10000");
  });
});

describe("articleSequenceOf", () => {
  it("relit la séquence d'une référence attribuée automatiquement", () => {
    expect(articleSequenceOf("ART-0001")).toBe(1);
    expect(articleSequenceOf("ART-0042")).toBe(42);
    expect(articleSequenceOf("ART-10000")).toBe(10000);
  });

  /**
   * Les références saisies à la main ou issues d'un fichier tiers ne portent
   * aucune séquence : elles ne doivent pas peser sur le prochain identifiant.
   */
  it("ignore toute référence hors format", () => {
    for (const reference of ["ROUL-6204", "1", "ART-", "ART-12A", "art-0001"]) {
      expect(articleSequenceOf(reference)).toBeNull();
    }
  });

  it("fait l'aller-retour avec le formatage", () => {
    for (const sequence of [1, 9, 10, 999, 1000, 10000]) {
      expect(articleSequenceOf(formatArticleReference(sequence))).toBe(sequence);
    }
  });
});
