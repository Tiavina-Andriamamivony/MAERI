"use client";

import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type DataTableToolbarProps = {
  globalFilter: string;
  onFilterChange: (value: string) => void;
  searchPlaceholder: string;
  rowCount: number;
  /** Fournie => affiche le bouton « Ajouter une ligne ». */
  onAdd?: () => void;
  /** Désactive le bouton d'ajout (ligne d'ajout déjà ouverte). */
  addDisabled?: boolean;
};

/** Barre au-dessus du tableau : recherche, compteur de lignes, bouton d'ajout. */
export default function DataTableToolbar({
  globalFilter,
  onFilterChange,
  searchPlaceholder,
  rowCount,
  onAdd,
  addDisabled,
}: DataTableToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      <Input
        value={globalFilter}
        onChange={(event) => onFilterChange(event.target.value)}
        placeholder={searchPlaceholder}
        className="max-w-xs"
      />
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          {rowCount} ligne(s)
        </span>
        {onAdd && (
          <Button
            variant="outline"
            size="sm"
            onClick={onAdd}
            disabled={addDisabled}
          >
            <PlusIcon className="size-4" />
            Ajouter une ligne
          </Button>
        )}
      </div>
    </div>
  );
}
