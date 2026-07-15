"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { UploadIcon } from "lucide-react";

import { importExcel } from "@/app/actions/excelImporter";
import type { ImportResult } from "@/types/import";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      <UploadIcon />
      {pending ? "Import en cours…" : "Importer le fichier Excel"}
    </Button>
  );
}

export default function ImportSection() {
  const [result, submit] = useActionState<ImportResult | null, FormData>(
    importExcel,
    null,
  );

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <form
        action={submit}
        className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
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
          {result.errors.map((error, index) => (
            <li key={index}>{error}</li>
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
              {sheet.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
