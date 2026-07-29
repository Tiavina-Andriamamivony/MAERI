import { subtractAmounts } from "@/lib/analyse/amounts";

/** Lit la valeur brute d'un champ, d'une ligne existante ou d'une saisie en cours. */
export type FieldReader<Row> = (key: keyof Row) => unknown;

/** Colonne adossée à un champ de la ligne : affichée, éditable, persistée. */
export type FieldColumn<Row> = {
  key: keyof Row;
  label: string;
  /** Type du champ en édition (défaut : texte). */
  type?: "number";
  /** Cellule affichée mais non modifiable (ex. clé unique). */
  readOnly?: boolean;
};

/**
 * Colonne calculée depuis deux champs numériques de la ligne. Elle est
 * affichée, triable et exportée, mais ni saisissable ni enregistrée en base :
 * son identifiant ne correspond à aucune colonne Prisma.
 *
 * L'opération est décrite par un nom (et non par une fonction) pour que la
 * définition reste sérialisable de bout en bout : les tableaux sont déclarés
 * dans des server components et consommés par {@link DataTable}, qui est un
 * composant client.
 */
export type DerivedColumn<Row> = {
  id: string;
  label: string;
  operation: "difference";
  /** Champ dont on retire {@link subtract} (ex. le prix de vente). */
  from: keyof Row;
  /** Champ retiré de {@link from} (ex. le prix d'achat). */
  subtract: keyof Row;
};

export type Column<Row> = FieldColumn<Row> | DerivedColumn<Row>;

export function isDerivedColumn<Row>(
  column: Column<Row>,
): column is DerivedColumn<Row> {
  return "operation" in column;
}

/**
 * Applique l'opération d'une colonne calculée aux champs d'une ligne.
 *
 * Le `switch` est exhaustif : ajouter une opération au type sans l'implémenter
 * ici casse la compilation, plutôt que de calculer silencieusement une
 * différence.
 */
export function computeDerived<Row>(
  column: DerivedColumn<Row>,
  row: Row,
): number | null {
  switch (column.operation) {
    case "difference":
      return subtractAmounts(row[column.from], row[column.subtract]);
    default: {
      const unhandled: never = column.operation;
      return unhandled;
    }
  }
}

/** Les seules colonnes qui portent une valeur à lire ou à enregistrer. */
export function fieldColumns<Row>(columns: Column<Row>[]): FieldColumn<Row>[] {
  return columns.filter(
    (column): column is FieldColumn<Row> => !isDerivedColumn(column),
  );
}
