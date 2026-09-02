import { toCardinal } from "n2words/fr-FR";

export function amountInWords(amount: number): string {
  const rounded = Math.round(amount * 100) / 100;
  const words = toCardinal(rounded);
  return `${words.charAt(0).toUpperCase()}${words.slice(1)} ariary`;
}

export function arreteProformaLine(amount: number): string {
  return `Arrêté la présente facture proforma à la somme de : ***${amountInWords(amount)}***.`;
}
