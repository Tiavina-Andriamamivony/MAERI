"use client";

import { useMemo } from "react";
import {
  type ColumnDef,
  type HeaderContext,
  type SortingFn,
} from "@tanstack/react-table";
import { ArrowUpDownIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  computeDerived,
  fieldColumns,
  isDerivedColumn,
  type Column,
  type DerivedColumn,
  type FieldColumn,
} from "./column-model";
import EditableCell from "./editable-cell";
import ReadOnlyCell from "./read-only-cell";

type UseTableColumnsParams<Row> = {
  columns: Column<Row>[];
  /** Active l'édition inline des cellules (hors colonnes `readOnly`). */
  editable: boolean;
  /** Appelé quand une cellule éditée est validée. */
  onEditCommit: (row: Row, key: keyof Row, newValue: string) => void;
  /** Ajoute une colonne d'action de suppression ancrée à droite. */
  deletable: boolean;
  /** Lance la suppression différée d'une ligne (id + libellé pour le toast). */
  onDelete: (id: number, label: string) => void;
  /** Colonne servant de libellé dans le toast de suppression. */
  labelKey?: keyof Row;
};

/**
 * Rendu d'en-tête triable, partagé par les deux types de colonnes : un bouton
 * qui alterne le tri croissant / décroissant.
 */
function sortableHeader<Row>(label: string): ColumnDef<Row>["header"] {
  return function SortableHeader({ column }: HeaderContext<Row, unknown>) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2.5 h-8 data-sorted:text-foreground"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {label}
        <ArrowUpDownIcon className="ml-1 size-3.5 opacity-60" />
      </Button>
    );
  };
}

/**
 * Tri numérique plaçant les valeurs inconnues en dernier, dans les deux sens :
 * un montant absent ne doit jamais occuper le haut du classement, alors que le
 * tri par défaut de TanStack le traite comme un zéro.
 */
function sortNumbersNullsLast<Row>(
  ...[rowA, rowB, columnId]: Parameters<SortingFn<Row>>
): number {
  const valueA = rowA.getValue<number | null>(columnId);
  const valueB = rowB.getValue<number | null>(columnId);

  if (valueA === null) return valueB === null ? 0 : 1;
  if (valueB === null) return -1;
  return valueA - valueB;
}

function buildFieldColumn<Row>(
  column: FieldColumn<Row>,
  editable: boolean,
  onEditCommit: UseTableColumnsParams<Row>["onEditCommit"],
): ColumnDef<Row> {
  const isEditable = editable && !column.readOnly;

  return {
    accessorKey: column.key as string,
    header: sortableHeader(column.label),
    // Les montants sont nullables : même politique de tri que les colonnes
    // calculées, sinon un prix absent remonterait en tête du tri croissant.
    sortingFn: column.type === "number" ? sortNumbersNullsLast : undefined,
    cell: ({ getValue, row }) => {
      if (!isEditable) return <ReadOnlyCell value={getValue()} />;

      return (
        <EditableCell
          value={getValue() as string | number | null}
          type={column.type}
          onCommit={(newValue) =>
            onEditCommit(row.original, column.key, newValue)
          }
        />
      );
    },
  };
}

/**
 * Colonne calculée : sa valeur est dérivée de la ligne à chaque rendu, ce qui
 * la rend triable et exportable comme une autre, mais jamais éditable.
 */
function buildDerivedColumn<Row>(column: DerivedColumn<Row>): ColumnDef<Row> {
  return {
    id: column.id,
    accessorFn: (row) => computeDerived(column, row),
    sortingFn: sortNumbersNullsLast,
    header: sortableHeader(column.label),
    cell: ({ getValue }) => <ReadOnlyCell value={getValue()} />,
  };
}

/** Colonne d'action de suppression, ancrée à droite du tableau. */
function buildActionsColumn<Row extends { id: number }>(
  labelKey: keyof Row | undefined,
  onDelete: UseTableColumnsParams<Row>["onDelete"],
): ColumnDef<Row> {
  return {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => {
      const label = labelKey ? String(row.original[labelKey] ?? "") : "";
      return (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(row.original.id, label)}
            aria-label={`Supprimer ${label}`.trim()}
          >
            <Trash2Icon className="size-4" />
          </Button>
        </div>
      );
    },
  };
}

/**
 * Construit les définitions de colonnes TanStack à partir des colonnes
 * métier : en-têtes triables, cellules en lecture seule, éditables ou
 * calculées, et une éventuelle colonne d'action de suppression à droite.
 */
export function useTableColumns<Row extends { id: number }>({
  columns,
  editable,
  onEditCommit,
  deletable,
  onDelete,
  labelKey,
}: UseTableColumnsParams<Row>): ColumnDef<Row>[] {
  return useMemo<ColumnDef<Row>[]>(() => {
    const definitions = columns.map((column) =>
      isDerivedColumn(column)
        ? buildDerivedColumn(column)
        : buildFieldColumn(column, editable, onEditCommit),
    );

    if (deletable) {
      const deletionLabelKey = labelKey ?? fieldColumns(columns)[0]?.key;
      definitions.push(buildActionsColumn(deletionLabelKey, onDelete));
    }

    return definitions;
  }, [columns, editable, onEditCommit, deletable, onDelete, labelKey]);
}
