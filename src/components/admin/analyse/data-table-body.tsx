"use client";

import { flexRender, type Table } from "@tanstack/react-table";

import type { ActionResult } from "@/lib/action-result";
import {
  Table as UiTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { Column } from "./data-table";
import NewRow from "./new-row";

type DataTableBodyProps<Row extends { id: number }> = {
  table: Table<Row>;
  columns: Column<Row>[];
  /** Nombre total de colonnes affichées (champs + éventuelle colonne d'action). */
  columnCount: number;
  emptyMessage: string;
  /** Server action de création, requise quand une ligne d'ajout est ouverte. */
  onCreate?: (formData: FormData) => Promise<ActionResult<Row>>;
  /** Vrai quand la ligne d'ajout vierge doit être affichée. */
  isAdding: boolean;
  /** Ferme la ligne d'ajout (après enregistrement ou annulation). */
  onCloseAdd: () => void;
};

/** En-têtes + corps du tableau, avec la ligne d'ajout et le message vide. */
export default function DataTableBody<Row extends { id: number }>({
  table,
  columns,
  columnCount,
  emptyMessage,
  onCreate,
  isAdding,
  onCloseAdd,
}: DataTableBodyProps<Row>) {
  const visibleRows = table.getRowModel().rows;
  // Message « aucune donnée » : seulement si le tableau est vide ET qu'on
  // n'est pas déjà en train d'ajouter une ligne.
  const showEmptyMessage = visibleRows.length === 0 && !isAdding;

  return (
    <div className="overflow-hidden rounded-lg border">
      <UiTable>
        <TableHeader className="bg-muted">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="whitespace-nowrap">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isAdding && onCreate && (
            <NewRow
              columns={columns}
              onCreate={onCreate}
              onClose={onCloseAdd}
              columnCount={columnCount}
            />
          )}

          {visibleRows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="whitespace-nowrap">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}

          {showEmptyMessage && (
            <TableRow>
              <TableCell
                colSpan={columnCount}
                className="h-24 text-center text-muted-foreground italic"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </UiTable>
    </div>
  );
}
