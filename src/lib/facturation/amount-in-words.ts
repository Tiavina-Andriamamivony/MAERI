import { toCardinal } from "n2words/fr-FR";

/**
 * Montant en toutes lettres en français, suivi de la devise :
 * « 49800000 » → « Quarante-neuf millions huit cent mille ariary ».
 *
 * Le montant est arrondi à deux décimales avant conversion ; une valeur entière
 * ne produit aucune décimale en toutes lettres.
 */
export function amountInWords(amount: number): string {
  const rounded = Math.round(amount * 100) / 100;
  const words = toCardinal(rounded);
  return `${words.charAt(0).toUpperCase()}${words.slice(1)} ariary`;
}

/**
 * Ligne d'arrêté du proforma, avec le montant total TTC en toutes lettres :
 * « Arrêté la présente facture proforma à la somme de : ***…***. »
 */
export function arreteProformaLine(amount: number): string {
  return `Arrêté la présente facture proforma à la somme de : ***${amountInWords(amount)}***.`;
}
