/**
 * Mise en forme des valeurs du proforma, alignée sur le template Excel :
 * séparateur de milliers en espace fine, virgule décimale, dates en jj/mm/aaaa.
 */

/** Format de montant : « 49 800 000,00 ». */
const amountFormatter = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Format de quantité : décimales seulement quand nécessaire (« 4 », « 2,5 »). */
const quantityFormatter = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 2,
});

/** Format de pourcentage : « 20,00 % ». */
const percentFormatter = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Intl produit une espace fine insécable (U+202F), absente des polices
 * standard du PDF (Helvetica) : on la normalise en espace simple, comme le
 * template Excel.
 */
function normalizeSpaces(value: string): string {
  return value.replace(/[\u202f\u00a0]/g, " ");
}

export function formatAmount(value: number): string {
  return normalizeSpaces(amountFormatter.format(value));
}

export function formatQuantity(value: number): string {
  return normalizeSpaces(quantityFormatter.format(value));
}

export function formatPercent(value: number): string {
  return `${normalizeSpaces(percentFormatter.format(value))} %`;
}

/**
 * Parse une date. Une chaîne « aaaa-mm-jj » (input date) est lue en heure
 * locale : `new Date("2026-08-17")` produirait minuit UTC, qui peut décaler
 * le jour affiché selon le fuseau de la machine qui rend le PDF.
 */
function parseDate(value: Date | string): Date {
  if (typeof value !== "string") return value;
  const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!parts) return new Date(value);
  return new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]));
}

/** Formate une date au format « jj/mm/aaaa ». */
export function formatDate(value: Date | string | null | undefined): string {
  if (value === null || value === undefined || value === "") return "";
  const date = parseDate(value);
  if (Number.isNaN(date.getTime())) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${date.getFullYear()}`;
}

/** Formate une date au format attendu par un input `type="date"` (« aaaa-mm-jj »). */
export function toDateInputValue(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}
