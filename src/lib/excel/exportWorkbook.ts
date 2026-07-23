import { utils, write, type WorkBook } from "xlsx";

import type { Column } from "@/components/admin/analyse/data-table";

/** Un onglet à exporter : ses lignes, ses colonnes et le nom de l'onglet. */
export type SheetExport<Row> = {
  /** Nom de l'onglet dans le classeur (doit rester réimportable). */
  sheetName: string;
  columns: Column<Row>[];
  rows: Row[];
};

/**
 * Construit une feuille : première ligne = libellés des colonnes (en-têtes
 * reconnus à l'import), lignes suivantes = valeurs. Les cellules vides
 * (`null` / `undefined`) sont laissées vides plutôt que d'afficher « null ».
 */
function buildSheet<Row>(columns: Column<Row>[], rows: Row[]) {
  const header = columns.map((column) => column.label);
  const body = rows.map((row) =>
    columns.map((column) => row[column.key] ?? "")
  );
  return utils.aoa_to_sheet([header, ...body]);
}

/**
 * Assemble un classeur Excel (un onglet par tableau) et le renvoie sous forme
 * de `Buffer`, prêt à être servi en téléchargement.
 *
 * Le typage de chaque onglet lui est propre, d'où le paramètre `SheetExport<any>` :
 * `buildSheet` reste entièrement typé, seule la liste hétérogène est élargie.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildWorkbookBuffer(sheets: SheetExport<any>[]): Buffer {
  const workbook: WorkBook = utils.book_new();
  for (const { sheetName, columns, rows } of sheets) {
    utils.book_append_sheet(workbook, buildSheet(columns, rows), sheetName);
  }
  return write(workbook, { type: "buffer", bookType: "xlsx" });
}
