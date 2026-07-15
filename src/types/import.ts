export type TableName = "Client" | "Article";

export type SheetImportSummary = {
  sheet: string;
  table: TableName;
  inserted: number;
  updated: number;
  errors: string[];
};

export type ImportResult = {
  ok: boolean;
  sheets: SheetImportSummary[];
  errors: string[];
};
