import { describe, expect, it } from "vitest";

import type { ProformaInput } from "@/lib/validations/proforma";
import { proformaSchema } from "@/lib/validations/proforma";

import { renderProformaPdf } from "./proforma-pdf";

/** Échantillon calqué sur la ligne de démonstration du template Excel. */
const sample: ProformaInput = {
  pf_num: "MA-ERI_250-26",
  date: new Date(2026, 7, 17),
  client_id: 1,
  client_code: "056",
  client_name: "CCIS",
  client_address: "Betainomby- Fokontany d'Ambodisaina/Tamatave",
  client_province: "Tamatave",
  client_nif: null,
  client_stat: null,
  client_rcs: null,
  client_contact: "M. Heyris R.",
  client_phone: "+261 32 11 234 20",
  client_mail: "tmm.hramanjaka@ccis-network.com",
  votre_reference: "WHATSAPP du 24/6/26",
  validite_offre: new Date(2026, 8, 21),
  terme_paiement: 0,
  monnaie: "MGA",
  tva_active: false,
  tva_rate: 20,
  items: [
    {
      article_id: 1,
      designation: "PNEU REF: 1800-25 / 40PR / TUBELESS - Marque HONGLI",
      max_loading: "9750kg-50km/h\n17000kg-10km/h",
      pressure: "700kpa-50km/h\n950kpa-10km/h",
      dimension: "diamètre extérieur 1700mm / largeur 515mm",
      uom: "PC",
      quantite: 4,
      prix_unitaire: 12_450_000,
      remise_pct: 0,
    },
  ],
};

describe("proformaSchema", () => {
  it("valide l'échantillon tel qu'envoyé par le formulaire", () => {
    const parsed = proformaSchema.safeParse(sample);
    expect(parsed.success).toBe(true);
  });

  /**
   * Le formulaire valide côté client (les vides deviennent `null`, les dates
   * des objets Date), envoie le payload en JSON, et le serveur revalide : le
   * schéma doit accepter les deux formes.
   */
  it("résiste à l'aller-retour JSON entre le formulaire et le serveur", () => {
    const parsed = proformaSchema.parse(sample);
    const payload = JSON.parse(JSON.stringify(parsed));

    const roundTripped = proformaSchema.safeParse(payload);
    expect(roundTripped.success).toBe(true);
    if (roundTripped.success) {
      expect(roundTripped.data.pf_num).toBe(sample.pf_num);
      expect(roundTripped.data.items).toHaveLength(sample.items.length);
    }
  });

  it("laisse une date de validité vide devenir `null`", () => {
    const parsed = proformaSchema.safeParse({ ...sample, validite_offre: "" });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.validite_offre).toBeNull();
  });

  it("rejette une date obligatoire vide", () => {
    const parsed = proformaSchema.safeParse({ ...sample, date: "" });
    expect(parsed.success).toBe(false);
  });

  it("rejette une liste d'articles vide", () => {
    const parsed = proformaSchema.safeParse({ ...sample, items: [] });
    expect(parsed.success).toBe(false);
  });

  it("rejette plus de 11 lignes d'articles", () => {
    const items = Array.from({ length: 12 }, () => sample.items[0]);
    const parsed = proformaSchema.safeParse({ ...sample, items });
    expect(parsed.success).toBe(false);
  });
});

describe("renderProformaPdf", () => {
  it("produit un PDF lisible", async () => {
    const pdf = await renderProformaPdf(sample);

    expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");
    expect(pdf.length).toBeGreaterThan(1_000);
  });

  it("embarque le logo et la signature (PDF nettement plus lourd que le texte seul)", async () => {
    const pdf = await renderProformaPdf(sample);

    // Sans les images, le PDF tient en ~10 Ko : le logo MA-ERI et la signature
    // (tous deux en PNG dans `public/`) font passer le fichier à ~90 Ko.
    expect(pdf.length).toBeGreaterThan(50_000);
  });
});
