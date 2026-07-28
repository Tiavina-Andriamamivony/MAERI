import type { FieldColumn, FieldReader } from "./column-model";

/**
 * Construit un `FormData` avec une entrée par colonne, prêt à être envoyé à
 * une server action. `readValue` fournit la valeur brute d'une colonne
 * (depuis une ligne existante ou une saisie en cours). Les valeurs nulles ou
 * absentes deviennent une chaîne vide — la forme attendue par les schémas zod.
 *
 * N'accepte que des colonnes adossées à un champ : une colonne calculée n'a
 * rien à envoyer au serveur.
 */
export function rowToFormData<Row>(
  columns: FieldColumn<Row>[],
  readValue: FieldReader<Row>,
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
