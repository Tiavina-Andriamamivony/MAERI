const isEmpty = (value: unknown): boolean =>
  value === null || value === undefined || value === "";

export function normalizeHeader(header: string): string {
  return header.trim().toUpperCase().replace(/\s+/g, " ");
}

export function toInteger(value: unknown): number | null {
  if (isEmpty(value)) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.trunc(parsed) : null;
}

export function toDecimal(value: unknown): number | null {
  if (isEmpty(value)) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function toText(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

export function toOptionalText(value: unknown): string | null {
  const text = toText(value);
  return text === "" ? null : text;
}

export function mapRowToFields<Field extends string>(
  row: Record<string, unknown>,
  headerToField: Record<string, Field>
): Partial<Record<Field, unknown>> {
  const fields: Partial<Record<Field, unknown>> = {};
  for (const [header, value] of Object.entries(row)) {
    const field = headerToField[normalizeHeader(header)];
    if (field) fields[field] = value;
  }
  return fields;
}
