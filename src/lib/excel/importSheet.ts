import { mapRowToFields } from "@/lib/excel/converters";

type RowKey = string | number;

type ParsedRow<Data> =
  | { valid: false; error: string }
  | { valid: true; key: RowKey; keyLabel: string; data: Data };

export type SheetImporter<Field extends string, Data> = {
  headerToField: Record<string, Field>;
  parseRow: (fields: Partial<Record<Field, unknown>>) => ParsedRow<Data>;
  loadExistingKeys: () => Promise<Set<RowKey>>;
  save: (key: RowKey, data: Data) => Promise<void>;
};

export type ImportCounts = {
  inserted: number;
  updated: number;
  errors: string[];
};

const HEADER_ROW_OFFSET = 2;

export async function importSheet<Field extends string, Data>(
  rows: Record<string, unknown>[],
  importer: SheetImporter<Field, Data>
): Promise<ImportCounts> {
  const existingKeys = await importer.loadExistingKeys();
  const errors: string[] = [];
  let inserted = 0;
  let updated = 0;

  for (let index = 0; index < rows.length; index++) {
    const lineNumber = index + HEADER_ROW_OFFSET;
    const fields = mapRowToFields(rows[index], importer.headerToField);
    const parsed = importer.parseRow(fields);

    if (!parsed.valid) {
      errors.push(`Ligne ${lineNumber} : ${parsed.error}, ignorée.`);
      continue;
    }

    try {
      const alreadyExisted = existingKeys.has(parsed.key);
      await importer.save(parsed.key, parsed.data);
      if (alreadyExisted) {
        updated++;
      } else {
        inserted++;
        existingKeys.add(parsed.key);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`Ligne ${lineNumber} (${parsed.keyLabel}) : ${message}`);
    }
  }

  return { inserted, updated, errors };
}
