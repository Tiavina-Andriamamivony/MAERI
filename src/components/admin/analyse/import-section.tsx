"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { DownloadIcon, UploadIcon } from "lucide-react";

import { importExcel } from "@/app/actions/excelImporter";
import type { ImportResult } from "@/types/import";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const EXPORT_URL = "/api/admin/analyses/export";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      <UploadIcon />
      {pending ? "Import en cours…" : "Importer le fichier Excel"}
    </Button>
  );
}

/** Télécharge les tableaux Clients + Articles dans un classeur Excel. */
function ExportButton() {
  return (
    <a
      href={EXPORT_URL}
      download
      className={cn(buttonVariants({ variant: "outline" }))}
    >
      <DownloadIcon />
      Exporter en Excel
    </a>
  );
}

export default function ImportSection() {
  const [result, submit] = useActionState<ImportResult | null, FormData>(
    importExcel,
    null,
  );

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <form
          action={submit}
          className="flex flex-1 flex-col items-stretch gap-3 sm:flex-row sm:items-center"
        >
          <Input
            type="file"
            name="file"
            accept=".xlsx,.xls"
            required
            className="cursor-pointer"
          />
          <SubmitButton />
        </form>
        <ExportButton />
      </div>

      {result && <ImportFeedback result={result} />}
    </div>
  );
}

function ImportFeedback({ result }: { result: ImportResult }) {
  return (
    <div
      className={cn(
        "rounded-lg border p-3 text-sm",
        result.ok
          ? "border-border bg-muted text-foreground"
          : "border-destructive/40 bg-destructive/10 text-foreground",
      )}
    >
      {result.errors.length > 0 && (
        <ul className="list-disc pl-5">
          {result.errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}

      {result.sheets.map((sheet) => (
        <div key={sheet.sheet} className="mb-2 last:mb-0">
          <p className="font-medium">
            {sheet.sheet} → {sheet.table} : {sheet.inserted} ajoutée(s),{" "}
            {sheet.updated} mise(s) à jour.
          </p>
          {sheet.errors.length > 0 && (
            <ul className="mt-1 list-disc pl-5 text-muted-foreground">
              {sheet.errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
