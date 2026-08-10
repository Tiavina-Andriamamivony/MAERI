import { subtractAmounts } from "@/lib/analyse/amounts";
import { formatClientCode } from "@/lib/analyse/codes";

/** Lit la valeur brute d'un champ, d'une ligne existante ou d'une saisie en cours. */
export type FieldReader<Row> = (key: keyof Row) => unknown;

/**
 * Mise en forme d'affichage d'un champ. Décrite par un nom (et non par une
 * fonction) pour que les définitions de colonnes restent sérialisables à
 * travers la frontière serveur/client — cf. {@link DerivedColumn}.
 */
export type FieldFormat = "clientCode";

/** Colonne adossée à un champ de la ligne : affichée, éditable, persistée. */
export type FieldColumn<Row> = {
  key: keyof Row;
  label: string;
  /** Type du champ en édition (défaut : texte). */
  type?: "number";
  /** Cellule affichée mais non modifiable (ex. clé unique). */
  readOnly?: boolean;
  /**
   * Valeur attribuée par le serveur à la création (code client, référence
   * article) : la colonne n'a donc pas de champ dans la ligne d'ajout, et
   * n'est pas envoyée à la server action de création.
   */
  generated?: boolean;
  /** Mise en forme à l'affichage et à l'export (défaut : valeur brute). */
  format?: FieldFormat;
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

/** Les colonnes dont la valeur est saisie par l'utilisateur à la création. */
export function inputColumns<Row>(
  columns: FieldColumn<Row>[],
): FieldColumn<Row>[] {
  return columns.filter((column) => !column.generated);
}

/**
 * Applique la mise en forme d'une colonne à la valeur brute d'un champ.
 *
 * Le `switch` est exhaustif : ajouter un format au type sans l'implémenter ici
 * casse la compilation, plutôt que d'afficher silencieusement la valeur brute.
 */
export function formatFieldValue<Row>(
  column: FieldColumn<Row>,
  value: unknown,
): unknown {
  if (column.format === undefined || value === null || value === undefined) {
    return value;
  }

  switch (column.format) {
    case "clientCode":
      return formatClientCode(Number(value));
    default: {
      const unhandled: never = column.format;
      return unhandled;
    }
  }
}
