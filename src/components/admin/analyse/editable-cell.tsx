"use client";

import { useEffect, useRef, useState } from "react";

import { Input } from "@/components/ui/input";

import ReadOnlyCell from "./read-only-cell";

type EditableCellProps = {
  value: string | number | null;
  /** Type du champ en édition (défaut : texte). */
  type?: "number";
  /** Appelé avec la nouvelle valeur quand l'édition est validée. */
  onCommit: (newValue: string) => void;
};

/**
 * Cellule éditable façon tableur : en lecture par défaut, elle passe en
 * saisie au double-clic. Entrée ou clic ailleurs valide, Échap annule.
 */
export default function EditableCell({
  value,
  type,
  onCommit,
}: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  // Passe à true sur Échap pour empêcher le `onBlur` suivant d'enregistrer.
  const cancelled = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const initialInputValue = value === null ? "" : String(value);

  // Donne le focus au champ dès qu'on passe en édition (remplace `autoFocus`).
  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  if (!isEditing) {
    return (
      <span
        onDoubleClick={() => {
          cancelled.current = false;
          setIsEditing(true);
        }}
        className="block cursor-text"
        title="Double-cliquez pour modifier"
      >
        <ReadOnlyCell value={value} />
      </span>
    );
  }

  return (
    <Input
      ref={inputRef}
      type={type === "number" ? "number" : "text"}
      step={type === "number" ? "any" : undefined}
      defaultValue={initialInputValue}
      className="h-8"
      onBlur={(event) => {
        setIsEditing(false);
        if (!cancelled.current) onCommit(event.target.value);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") event.currentTarget.blur();
        if (event.key === "Escape") {
          cancelled.current = true;
          event.currentTarget.blur();
        }
      }}
    />
  );
}
