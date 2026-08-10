"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

import type { ActionResult } from "@/lib/action-result";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";

import { inputColumns, type FieldColumn } from "./column-model";
import { rowToFormData } from "./row-form-data";
import { useRowMutation } from "./use-row-mutation";

type NewRowProps<Row> = {
  /**
   * Colonnes saisissables : ni les colonnes calculées, ni celles attribuées par
   * le serveur (code client, référence) n'ont de champ ici.
   */
  columns: FieldColumn<Row>[];
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
 * Ligne vierge éditable façon Prisma Studio. « Enregistrer » crée la ligne en
 * base, « Annuler » abandonne. La clé unique n'est pas saisie : le serveur lui
 * attribue le prochain identifiant libre.
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
  const firstInputIndex = columns.findIndex((column) => !column.generated);

  async function save() {
    // Les colonnes attribuées par le serveur sont exclues de l'envoi : leur
    // valeur est décidée en base, pas ici.
    const formData = rowToFormData(
      inputColumns(columns),
      (key) => values[key as string],
    );
    const saved = await run(formData, "Ligne ajoutée.");
    if (saved) onClose();
  }

  return (
    <>
      <TableRow>
        {columns.map((column, index) => (
          <NewRowCell
            key={column.key as string}
            column={column}
            value={values[column.key as string] ?? ""}
            // Le premier champ réellement saisissable reçoit le focus : la clé
            // attribuée par le serveur n'est pas un champ.
            focusOnMount={index === firstInputIndex}
            onChange={(newValue) =>
              setValues((current) => ({
                ...current,
                [column.key as string]: newValue,
              }))
            }
          />
        ))}
        {/* Cellules vides alignées sous les colonnes d'action du tableau. */}
        {Array.from({ length: trailingCells }, (_, index) => (
          <TableCell key={`trailing-${index}`} />
        ))}
      </TableRow>

      <TableRow>
        <TableCell colSpan={columnCount}>
          <NewRowActions
            onCancel={onClose}
            onSave={save}
            isSaving={isSaving}
          />
        </TableCell>
      </TableRow>
    </>
  );
}

type NewRowActionsProps = {
  onCancel: () => void;
  onSave: () => void;
  isSaving: boolean;
};

/** Boutons « Annuler » / « Enregistrer » de la ligne d'ajout. */
function NewRowActions({ onCancel, onSave, isSaving }: NewRowActionsProps) {
  return (
    <div className="flex justify-end gap-2">
      <Button variant="outline" size="sm" onClick={onCancel} disabled={isSaving}>
        Annuler
      </Button>
      <Button size="sm" onClick={onSave} disabled={isSaving}>
        {isSaving && <Loader2 className="animate-spin" />}
        Enregistrer
      </Button>
    </div>
  );
}

type NewRowCellProps<Row> = {
  column: FieldColumn<Row>;
  value: string;
  /** Donne le focus à ce champ au montage (première colonne de la ligne). */
  focusOnMount?: boolean;
  onChange: (newValue: string) => void;
};

/**
 * Une cellule de la ligne d'ajout : un champ de saisie, ou une mention
 * « automatique » pour la clé que le serveur attribuera à l'enregistrement.
 */
function NewRowCell<Row>({
  column,
  value,
  focusOnMount,
  onChange,
}: NewRowCellProps<Row>) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus programmatique plutôt que l'attribut `autoFocus` (accessibilité).
  useEffect(() => {
    if (focusOnMount) inputRef.current?.focus();
  }, [focusOnMount]);

  if (column.generated) {
    return (
      <TableCell className="whitespace-nowrap text-muted-foreground italic">
        Automatique
      </TableCell>
    );
  }

  return (
    <TableCell className="whitespace-nowrap">
      <Input
        ref={inputRef}
        type={column.type === "number" ? "number" : "text"}
        step={column.type === "number" ? "any" : undefined}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-8"
      />
    </TableCell>
  );
}
