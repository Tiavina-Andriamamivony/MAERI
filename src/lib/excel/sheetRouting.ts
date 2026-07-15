import { normalizeHeader } from "@/lib/excel/converters";
import type { SheetImporter } from "@/lib/excel/importSheet";
import type { TableName } from "@/types/import";
import { clientImporter } from "./importers/clientImporter";
import { articleImporter } from "./importers/articleImporter";

type Route = {
  table: TableName;
  matches: (normalizedSheetName: string) => boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  importer: SheetImporter<any, any>;
};

const ROUTES: Route[] = [
  {
    table: "Client",
    matches: (name) => name.includes("CLIENT"),
    importer: clientImporter,
  },
  {
    table: "Article",
    matches: (name) => name.includes("ARTICLE"),
    importer: articleImporter,
  },
];

export function routeSheet(sheetName: string): Route | null {
  const normalized = normalizeHeader(sheetName);
  return ROUTES.find((route) => route.matches(normalized)) ?? null;
}
