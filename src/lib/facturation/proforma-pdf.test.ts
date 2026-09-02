import { describe, expect, it } from "vitest";

import type { ProformaInput } from "@/lib/validations/proforma";
import { proformaSchema } from "@/lib/validations/proforma";

import type { DocumentClient } from "./pdf-base";
import { renderProformaPdf } from "./proforma-pdf";

/** Échantillon calqué sur la ligne de démonstration du template Excel. */
const sampleClient: DocumentClient = {
  code_client: 56,
  client: "CCIS",
  adress: "Betainomby- Fokontany d'Ambodisaina/Tamatave",
  province: "Tamatave",
  nif: null,
  stat: null,
  rcs: null,
  contact: "M. Heyris R.",
  phone: "+261 32 11 234 20",
  mail: "tmm.hramanjaka@ccis-network.com",
};

const sample: ProformaInput = {
  pf_num: "MA-ERI_250-26",
  date: new Date(2026, 7, 17),
  client_id: 1,
  votre_reference: "WHATSAPP du 24/6/26",
  validite_offre: new Date(2026, 8, 21),
  terme_paiement: 0,
  monnaie: "MGA",
  tva_active: false,
  tva_rate: 20,
  cif: "0120073/DGI-M du 11/04/25",
  delai_livraison: "8-9 semaines après confirmation de commande",
  conditions_paiement: "virement bancaire",
  items: [
    {
      article_id: 1,
      designation: "PNEU REF: 1800-25 / 40PR / TUBELESS - Marque HONGLI - Max loading: 9750kg-50km/h, 17000kg-10km/h - Pressure: 700kpa-50km/h, 950kpa-10km/h - Dimension: diamètre extérieur 1700mm / largeur 515mm",
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
    const pdf = await renderProformaPdf(sample, sampleClient);

    expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");
    expect(pdf.length).toBeGreaterThan(1_000);
  });

  it("embarque le logo et la signature (PDF nettement plus lourd que le texte seul)", async () => {
    const pdf = await renderProformaPdf(sample, sampleClient);

    // Sans les images, le PDF tient en ~10 Ko : le logo MA-ERI et la signature
    // (tous deux en PNG dans `public/`) font passer le fichier à ~90 Ko.
    expect(pdf.length).toBeGreaterThan(50_000);
  });
});
