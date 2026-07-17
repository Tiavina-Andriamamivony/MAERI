"use client";

import { useCallback, useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import {
  ArrowUpDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";

import type { ActionResult } from "@/lib/action-result";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import EditableCell from "./editable-cell";
import NewRow from "./new-row";
import { rowToFormData } from "./row-form-data";
import { useRowDeletion } from "./use-row-deletion";
import { useRowMutation } from "./use-row-mutation";

export type Column<Row> = {
  key: keyof Row;
  label: string;
  /** Type du champ en édition (défaut : texte). */
  type?: "number";
  /** Cellule affichée mais non modifiable (ex. clé unique). */
  readOnly?: boolean;
};

type DataTableProps<Row extends { id: number }> = {
  columns: Column<Row>[];
  rows: Row[];
  emptyMessage: string;
  searchPlaceholder?: string;
  /**
   * Server action de mise à jour. Fournie => double-cliquer sur une cellule
   * l'édite directement dans le tableau ; absente => tableau en lecture seule.
   */
  onSave?: (formData: FormData) => Promise<ActionResult<Row>>;
  /**
   * Server action de création. Fournie => un bouton « Ajouter une ligne »
   * ouvre une ligne vierge éditable dans le tableau.
   */
  onCreate?: (formData: FormData) => Promise<ActionResult<Row>>;
  /**
   * Server action de suppression. Fournie => une colonne d'action affiche un
   * bouton corbeille par ligne, avec fenêtre d'annulation de 5 s (cf.
   * {@link useRowDeletion}).
   */
  onDelete?: (id: number) => Promise<ActionResult<Row>>;
  /**
   * Colonne à utiliser comme libellé d'une ligne dans le toast de suppression
   * (ex. `reference`). Par défaut, la première colonne. Une clé (et non une
   * fonction) pour rester sérialisable à travers la frontière serveur/client.
   */
  labelKey?: keyof Row;
};

const PAGE_SIZES = [10, 20, 30, 40, 50];

export default function DataTable<Row extends { id: number }>({
  columns,
  rows,
  emptyMessage,
  searchPlaceholder = "Rechercher…",
  onSave,
  onCreate,
  onDelete,
  labelKey,
}: DataTableProps<Row>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const saveMutation = useRowMutation(onSave);
  const { pendingIds, remove } = useRowDeletion(onDelete);

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

  const tableColumns = useMemo<ColumnDef<Row>[]>(() => {
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
        if (!onSave || column.readOnly) {
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
              saveCell(row.original, column.key, newValue)
            }
          />
        );
      },
    }));

    // Colonne d'action de suppression, ancrée à droite.
    if (onDelete) {
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
                onClick={() => remove(row.original.id, label)}
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
  }, [columns, onSave, onDelete, labelKey, saveCell, remove]);

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

  const pageSize = table.getState().pagination.pageSize;
  const visibleRows = table.getRowModel().rows;
  // Message « aucune donnée » : seulement si le tableau est vide ET qu'on
  // n'est pas déjà en train d'ajouter une ligne.
  const showEmptyMessage = visibleRows.length === 0 && !isAdding;

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <Input
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          placeholder={searchPlaceholder}
          className="max-w-xs"
        />
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {table.getFilteredRowModel().rows.length} ligne(s)
          </span>
          {onCreate && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAdding(true)}
              disabled={isAdding}
            >
              <PlusIcon className="size-4" />
              Ajouter une ligne
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table>
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
                onClose={() => setIsAdding(false)}
                columnCount={tableColumns.length}
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
                  colSpan={tableColumns.length}
                  className="h-24 text-center text-muted-foreground italic"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <Label htmlFor="rows-per-page" className="text-sm font-medium">
            Lignes par page
          </Label>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger size="sm" className="w-20" id="rows-per-page">
              <SelectValue placeholder={`${pageSize}`} />
            </SelectTrigger>
            <SelectContent side="top">
              <SelectGroup>
                {PAGE_SIZES.map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} sur{" "}
            {table.getPageCount() || 1}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Première page</span>
              <ChevronsLeftIcon />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Page précédente</span>
              <ChevronLeftIcon />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Page suivante</span>
              <ChevronRightIcon />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Dernière page</span>
              <ChevronsRightIcon />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
