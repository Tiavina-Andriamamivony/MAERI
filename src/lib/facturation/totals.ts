import type { ProformaItemInput } from "@/lib/validations/proforma";

/**
 * Calculs des montants du proforma, purs et partagés entre le PDF et la
 * server action (le rendu ne fait jamais confiance aux valeurs du client).
 *
 * Modèle du template :
 * - chaque ligne : brut = quantité × prix unitaire, remise = brut × remise %,
 *   net = brut − remise ;
 * - sous-total = somme des bruts, remise = sous-total − somme des nets
 *   (dérivée pour que la chaîne affichée « sous-total − remise = net » soit
 *   exacte à l'arrondi près) ;
 * - TVA globale appliquée une seule fois sur le montant net (pas ligne par
 *   ligne), puis total = net + TVA.
 */

/** Arrondi monétaire à deux décimales (ariary). */
function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export interface LineTotals {
  /** Montant brut : quantité × prix unitaire. */
  brut: number;
  /** Montant de la remise de la ligne : brut × remise %. */
  remise: number;
  /** Montant net de la ligne : brut − remise. */
  net: number;
}

export interface ProformaTotals {
  /** Somme des montants bruts des lignes. */
  sous_total: number;
  /** Somme des remises des lignes. */
  remise: number;
  /** Pourcentage global de remise (remise / sous-total), pour l'étiquette. */
  remise_pct: number;
  /** Sous-total net de remises. */
  montant_net: number;
  /** TVA globale sur le montant net, 0 si désactivée. */
  montant_tva: number;
  /** Montant final TTC. */
  montant_total: number;
}

export function lineTotals(
  item: Pick<ProformaItemInput, "quantite" | "prix_unitaire" | "remise_pct">,
): LineTotals {
  const brut = round2(item.quantite * item.prix_unitaire);
  const remise = round2(brut * (item.remise_pct / 100));
  return { brut, remise, net: round2(brut - remise) };
}

export function proformaTotals(
  items: ProformaItemInput[],
  tva_active: boolean,
  tva_rate: number,
): ProformaTotals {
  const lines = items.map(lineTotals);
  const sous_total = round2(
    lines.reduce((sum, line) => sum + line.brut, 0),
  );
  const montant_net = round2(
    lines.reduce((sum, line) => sum + line.net, 0),
  );
  const remise = round2(sous_total - montant_net);
  const montant_tva = tva_active ? round2(montant_net * (tva_rate / 100)) : 0;

  return {
    sous_total,
    remise,
    remise_pct: sous_total > 0 ? (remise / sous_total) * 100 : 0,
    montant_net,
    montant_tva,
    montant_total: round2(montant_net + montant_tva),
  };
}
