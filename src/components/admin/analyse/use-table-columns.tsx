"use client";

import { useMemo } from "react";
import { type ColumnDef, type SortingFn } from "@tanstack/react-table";
import { ArrowUpDownIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  computeDerived,
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

/** En-tête cliquable qui alterne le tri croissant / décroissant. */
function SortableHeader({
  label,
  isSortedAscending,
  onToggle,
}: {
  label: string;
  isSortedAscending: boolean;
  onToggle: (descending: boolean) => void;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-2.5 h-8 data-sorted:text-foreground"
      onClick={() => onToggle(isSortedAscending)}
    >
      {label}
      <ArrowUpDownIcon className="ml-1 size-3.5 opacity-60" />
    </Button>
  );
}

/**
 * Tri numérique plaçant les valeurs inconnues en dernier, dans les deux sens :
 * une marge non calculable ne doit jamais occuper le haut du classement.
 */
function sortNumbersNullsLast<Row>(): SortingFn<Row> {
  return (rowA, rowB, columnId) => {
    const a = rowA.getValue<number | null>(columnId);
    const b = rowB.getValue<number | null>(columnId);

    if (a === null) return b === null ? 0 : 1;
    if (b === null) return -1;
    return a - b;
  };
}

function buildFieldColumn<Row>(
  column: FieldColumn<Row>,
  editable: boolean,
  onEditCommit: UseTableColumnsParams<Row>["onEditCommit"],
): ColumnDef<Row> {
  const isEditable = editable && !column.readOnly;

  return {
    accessorKey: column.key as string,
    header: ({ column: tableColumn }) => (
      <SortableHeader
        label={column.label}
        isSortedAscending={tableColumn.getIsSorted() === "asc"}
        onToggle={tableColumn.toggleSorting}
      />
    ),
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
    accessorFn: (row) => computeDerived(column, (key) => row[key]),
    sortingFn: sortNumbersNullsLast<Row>(),
    header: ({ column: tableColumn }) => (
      <SortableHeader
        label={column.label}
        isSortedAscending={tableColumn.getIsSorted() === "asc"}
        onToggle={tableColumn.toggleSorting}
      />
    ),
    cell: ({ getValue }) => <ReadOnlyCell value={getValue()} />,
  };
}

function buildActionsColumn<Row extends { id: number }>(
  columns: Column<Row>[],
  onDelete: UseTableColumnsParams<Row>["onDelete"],
  labelKey?: keyof Row,
): ColumnDef<Row> {
  const firstField = columns.find(
    (column): column is FieldColumn<Row> => !isDerivedColumn(column),
  );

  return {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => {
      const key = labelKey ?? firstField?.key;
      const label = key ? String(row.original[key] ?? "") : "";
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
      definitions.push(buildActionsColumn(columns, onDelete, labelKey));
    }

    return definitions;
  }, [columns, editable, onEditCommit, deletable, onDelete, labelKey]);
}
