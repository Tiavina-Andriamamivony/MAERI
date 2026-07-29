import { isEmpty } from "@/lib/excel/converters";

/** Affiché à la place d'une valeur absente. */
export const EMPTY_CELL = "—";

/**
 * Cellule non modifiable : rend la valeur telle quelle, ou un tiret atténué
 * quand elle est absente. Utilisée pour les colonnes verrouillées, les
 * tableaux en lecture seule et les colonnes calculées.
 */
export default function ReadOnlyCell({ value }: { value: unknown }) {
  if (isEmpty(value)) {
    return <span className="text-muted-foreground">{EMPTY_CELL}</span>;
  }

  return <span className="text-foreground/90">{String(value)}</span>;
}
