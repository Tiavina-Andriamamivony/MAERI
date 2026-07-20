"use client";

import { useCallback, useMemo, useState } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";

import type { ActionResult } from "@/lib/action-result";

import DataTableBody from "./data-table-body";
import DataTablePagination from "./data-table-pagination";
import DataTableToolbar from "./data-table-toolbar";
import { rowToFormData } from "./row-form-data";
import { useRowDeletion } from "./use-row-deletion";
import { useRowMutation } from "./use-row-mutation";
import { useTableColumns } from "./use-table-columns";

export type Column<Row> = {
  key: keyof Row;
  label: string;
  /** Type du champ en édition (défaut : texte). */
  type?: "number";
  /** Cellule affichée mais non modifiable (ex. clé unique). */
  readOnly?: boolean;
};

/**
 * Server actions CRUD du tableau. Chaque action est optionnelle et active la
 * fonctionnalité correspondante :
 *
 * - `update` => double-cliquer sur une cellule l'édite dans le tableau ;
 * - `create` => un bouton « Ajouter une ligne » ouvre une ligne vierge ;
 * - `delete` => une colonne d'action affiche un bouton corbeille par ligne,
 *   avec fenêtre d'annulation de 5 s (cf. {@link useRowDeletion}).
 *
 * Sans aucune action, le tableau est en lecture seule.
 */
export type RowActions<Row> = {
  update?: (formData: FormData) => Promise<ActionResult<Row>>;
  create?: (formData: FormData) => Promise<ActionResult<Row>>;
  delete?: (id: number) => Promise<ActionResult<Row>>;
  /**
   * Colonne à utiliser comme libellé d'une ligne dans le toast de suppression
   * (ex. `reference`). Par défaut, la première colonne. Une clé (et non une
   * fonction) pour rester sérialisable à travers la frontière serveur/client.
   */
  labelKey?: keyof Row;
};

type DataTableProps<Row extends { id: number }> = {
  columns: Column<Row>[];
  rows: Row[];
  emptyMessage: string;
  searchPlaceholder?: string;
  actions?: RowActions<Row>;
};

export default function DataTable<Row extends { id: number }>({
  columns,
  rows,
  emptyMessage,
  searchPlaceholder = "Rechercher…",
  actions,
}: DataTableProps<Row>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const saveMutation = useRowMutation(actions?.update);
  const { pendingIds, remove } = useRowDeletion(actions?.delete);

  // Masque les lignes en attente de suppression définitive (fenêtre d'undo).
  const visibleData = useMemo(
    () => rows.filter((row) => !pendingIds.has(row.id)),
    [rows, pendingIds]
  );

  // Enregistre une cellule modifiée : on renvoie toute la ligne au serveur
  // (avec la nouvelle valeur), qui la revalide et met le tableau à jour.
  const saveCell = useCallback(
    (row: Row, key: keyof Row, newValue: string) => {
      if (String(row[key] ?? "") === newValue) return; // rien n'a changé

      const formData = rowToFormData(columns, (columnKey) => row[columnKey]);
      formData.set("id", String(row.id));
      formData.set(key as string, newValue);

      saveMutation.run(formData, "Modification enregistrée.");
    },
    [columns, saveMutation]
  );

  const tableColumns = useTableColumns({
    columns,
    editable: !!actions?.update,
    onEditCommit: saveCell,
    deletable: !!actions?.delete,
    onDelete: remove,
    labelKey: actions?.labelKey,
  });

  const table = useReactTable({
    data: visibleData,
    columns: tableColumns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="flex w-full flex-col gap-4">
      <DataTableToolbar
        globalFilter={globalFilter}
        onFilterChange={setGlobalFilter}
        searchPlaceholder={searchPlaceholder}
        rowCount={table.getFilteredRowModel().rows.length}
        onAdd={actions?.create ? () => setIsAdding(true) : undefined}
        addDisabled={isAdding}
      />

      <DataTableBody
        table={table}
        columns={columns}
        columnCount={tableColumns.length}
        emptyMessage={emptyMessage}
        onCreate={actions?.create}
        isAdding={isAdding}
        onCloseAdd={() => setIsAdding(false)}
      />

      <DataTablePagination table={table} />
    </div>
  );
}
