"use server";

import { read, utils, type WorkSheet } from "xlsx";
import { revalidatePath } from "next/cache";
import { routeSheet } from "@/lib/excel/sheetRouting";
import { importSheet } from "@/lib/excel/importSheet";
import type { ImportResult, SheetImportSummary } from "@/types/import";

const ACCEPTED_EXTENSIONS = /\.(xlsx|xls)$/i;

function readWorkbookRows(worksheet: WorkSheet): Record<string, unknown>[] {
  return utils.sheet_to_json<Record<string, unknown>>(worksheet, {
    defval: null,
  });
}

export async function importExcel(
  _previousState: ImportResult | null,
  formData: FormData
): Promise<ImportResult> {
  const sheets: SheetImportSummary[] = [];

  try {
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return { ok: false, sheets, errors: ["Aucun fichier fourni."] };
    }
    if (!ACCEPTED_EXTENSIONS.test(file.name)) {
      return {
        ok: false,
        sheets,
        errors: ["Le fichier doit être au format .xlsx ou .xls."],
      };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = read(buffer, { type: "buffer" });

    if (workbook.SheetNames.length === 0) {
      return { ok: false, sheets, errors: ["Le classeur est vide."] };
    }

    for (const sheetName of workbook.SheetNames) {
      const route = routeSheet(sheetName);
      if (!route) continue;

      const rows = readWorkbookRows(workbook.Sheets[sheetName]);
      const counts = await importSheet(rows, route.importer);
      sheets.push({ sheet: sheetName, table: route.table, ...counts });
    }

    revalidatePath("/admin/analyses");

    const globalErrors =
      sheets.length === 0
        ? [
            "Aucun onglet reconnu (attendus : 'base de données client' et/ou 'base de données article').",
          ]
        : [];
    const ok =
      globalErrors.length === 0 && sheets.every((sheet) => sheet.errors.length === 0);

    return { ok, sheets, errors: globalErrors };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, sheets, errors: [`Erreur d'import : ${message}`] };
  }
}
