import type { Column } from "./data-table";

/**
 * Construit un `FormData` avec une entrée par colonne, prêt à être envoyé à
 * une server action. `readValue` fournit la valeur brute d'une colonne
 * (depuis une ligne existante ou une saisie en cours). Les valeurs nulles ou
 * absentes deviennent une chaîne vide — la forme attendue par les schémas zod.
 */
export function rowToFormData<Row>(
  columns: Column<Row>[],
  readValue: (key: keyof Row) => unknown,
): FormData {
  const formData = new FormData();
  for (const column of columns) {
    const value = readValue(column.key);
    formData.set(
      column.key as string,
      value === null || value === undefined ? "" : String(value),
    );
  }
  return formData;
}
