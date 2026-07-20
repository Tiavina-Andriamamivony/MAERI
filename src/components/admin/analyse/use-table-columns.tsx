"use client";

import { useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDownIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { Column } from "./data-table";
import EditableCell from "./editable-cell";

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
 * Construit les définitions de colonnes TanStack à partir des colonnes
 * métier : en-têtes triables, cellules en lecture seule ou éditables, et une
 * éventuelle colonne d'action de suppression ancrée à droite.
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
    const dataColumns: ColumnDef<Row>[] = columns.map((column) => ({
      accessorKey: column.key as string,
      header: ({ column: col }) => (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2.5 h-8 data-sorted:text-foreground"
          onClick={() => col.toggleSorting(col.getIsSorted() === "asc")}
        >
          {column.label}
          <ArrowUpDownIcon className="ml-1 size-3.5 opacity-60" />
        </Button>
      ),
      cell: ({ getValue, row }) => {
        const value = getValue() as string | number | null;

        // Lecture seule : ni édition activée, ni colonne verrouillée.
        if (!editable || column.readOnly) {
          return (
            <span className="text-foreground/90">
              {value === null || value === undefined ? "" : String(value)}
            </span>
          );
        }

        return (
          <EditableCell
            value={value}
            type={column.type}
            onCommit={(newValue) =>
              onEditCommit(row.original, column.key, newValue)
            }
          />
        );
      },
    }));

    // Colonne d'action de suppression, ancrée à droite.
    if (deletable) {
      dataColumns.push({
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => {
          const key = labelKey ?? columns[0].key;
          const label = String(row.original[key] ?? "");
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
      });
    }

    return dataColumns;
  }, [columns, editable, onEditCommit, deletable, onDelete, labelKey]);
}
