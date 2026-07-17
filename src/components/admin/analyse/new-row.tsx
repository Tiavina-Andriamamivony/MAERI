"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import type { ActionResult } from "@/lib/action-result";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";

import type { Column } from "./data-table";
import { rowToFormData } from "./row-form-data";
import { useRowMutation } from "./use-row-mutation";

type NewRowProps<Row> = {
  columns: Column<Row>[];
  onCreate: (formData: FormData) => Promise<ActionResult<Row>>;
  /** Ferme la ligne d'ajout (après enregistrement ou annulation). */
  onClose: () => void;
  /**
   * Nombre total de colonnes du tableau (champs + éventuelle colonne d'action).
   * Sert à aligner la ligne d'ajout : cellule vide de fin et `colSpan`.
   */
  columnCount: number;
};

/**
 * Ligne vierge éditable façon Prisma Studio : toutes les cellules sont des
 * champs (y compris la clé, saisissable pour une création). « Enregistrer »
 * crée la ligne en base, « Annuler » abandonne.
 */
export default function NewRow<Row>({
  columns,
  onCreate,
  onClose,
  columnCount,
}: NewRowProps<Row>) {
  // Cellules vides à ajouter après les champs pour couvrir les colonnes
  // supplémentaires du tableau (ex. colonne d'action de suppression).
  const trailingCells = Math.max(0, columnCount - columns.length);
  const [values, setValues] = useState<Record<string, string>>({});
  const { run, isSaving } = useRowMutation(onCreate);

  async function save() {
    const formData = rowToFormData(columns, (key) => values[key as string]);
    const saved = await run(formData, "Ligne ajoutée.");
    if (saved) onClose();
  }

  return (
    <>
      <TableRow>
        {/*
          Toutes les colonnes sont éditables ici, y compris la clé (ex.
          `reference`, marquée `readOnly`) : à la création il faut pouvoir la
          saisir, alors qu'en édition d'une ligne existante elle reste
          verrouillée. La validation zod (schéma de création) reste la garde.
        */}
        {columns.map((column, index) => {
          const name = column.key as string;
          return (
            <TableCell key={name} className="whitespace-nowrap">
              <Input
                autoFocus={index === 0}
                type={column.type === "number" ? "number" : "text"}
                step={column.type === "number" ? "any" : undefined}
                value={values[name] ?? ""}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    [name]: event.target.value,
                  }))
                }
                className="h-8"
              />
            </TableCell>
          );
        })}
        {/* Cellules vides alignées sous les colonnes d'action du tableau. */}
        {Array.from({ length: trailingCells }, (_, index) => (
          <TableCell key={`trailing-${index}`} />
        ))}
      </TableRow>

      <TableRow>
        <TableCell colSpan={columnCount}>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSaving}
            >
              Annuler
            </Button>
            <Button size="sm" onClick={save} disabled={isSaving}>
              {isSaving && <Loader2 className="animate-spin" />}
              Enregistrer
            </Button>
          </div>
        </TableCell>
      </TableRow>
    </>
  );
}
