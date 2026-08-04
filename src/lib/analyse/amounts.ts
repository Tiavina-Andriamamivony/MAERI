import { toDecimal } from "@/lib/excel/converters";

// Les montants sont des flottants : la soustraction produit des artefacts
// (150,5 − 100,2 = 50,299999…). On arrondit au centime.
const CENTS = 100;

/**
 * Différence entre deux montants, arrondie au centime.
 *
 * Renvoie `null` si l'un des deux est absent ou non numérique — une différence
 * inconnue n'est pas une différence nulle.
 */
export function subtractAmounts(
  minuend: unknown,
  subtrahend: unknown,
): number | null {
  const from = toDecimal(minuend);
  const amount = toDecimal(subtrahend);

  if (from === null || amount === null) return null;

  return Math.round((from - amount) * CENTS) / CENTS;
}

/**
 * Part qu'un montant représente d'un autre, en pourcentage arrondi au dixième.
 *
 * Renvoie `null` si un montant est absent, ou si la base est nulle — on ne peut
 * pas exprimer un pourcentage d'un prix d'achat de zéro.
 */
export function percentageOf(amount: unknown, base: unknown): number | null {
  const value = toDecimal(amount);
  const reference = toDecimal(base);

  if (value === null || reference === null || reference === 0) return null;

  return Math.round((value / reference) * 100 * 10) / 10;
}
