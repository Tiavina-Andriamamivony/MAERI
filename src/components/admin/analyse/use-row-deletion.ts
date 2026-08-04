"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import type { ActionResult } from "@/lib/action-result";

/** Délai d'annulation avant que la suppression ne devienne définitive. */
const UNDO_DELAY_MS = 5000;

/**
 * Suppression de ligne avec fenêtre d'annulation. La ligne disparaît
 * immédiatement du tableau et un toast « Annuler » s'affiche pendant 5 s :
 *
 * - **Annuler** dans les 5 s : le compte à rebours est stoppé, la ligne
 *   réapparaît et **aucun appel serveur** n'est fait.
 * - **Rien** au bout de 5 s : la server action de suppression est appelée et
 *   la ligne est retirée de la base pour de bon.
 *
 * Ce report évite de supprimer puis recréer (ce qui changerait l'`id`
 * auto-incrémenté) : un seul aller-retour, seulement si l'undo n'a pas eu lieu.
 *
 * - `pendingIds` : identifiants masqués en attente de suppression définitive.
 * - `remove(id, label)` : lance la suppression différée de la ligne.
 */
export function useRowDeletion<Row>(
  action?: (id: number) => Promise<ActionResult<Row>>,
) {
  const [pendingIds, setPendingIds] = useState<Set<number>>(new Set());
  // Timers de suppression en cours, indexés par identifiant de ligne.
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const unhide = useCallback((id: number) => {
    setPendingIds((current) => {
      const next = new Set(current);
      next.delete(id);
      return next;
    });
  }, []);

  const remove = useCallback(
    (id: number, label: string) => {
      if (!action) return;

      setPendingIds((current) => new Set(current).add(id));

      const timer = setTimeout(async () => {
        timers.current.delete(id);
        const result = await action(id);
        if (!result.success) {
          unhide(id); // échec serveur : on ré-affiche la ligne
          toast.error(result.error);
        }
      }, UNDO_DELAY_MS);
      timers.current.set(id, timer);

      toast(`${label} supprimé(e).`, {
        duration: UNDO_DELAY_MS,
        action: {
          label: "Annuler",
          onClick: () => {
            clearTimeout(timer);
            timers.current.delete(id);
            unhide(id);
          },
        },
      });
    },
    [action, unhide],
  );

  // À la disparition du composant, on stoppe les comptes à rebours en cours
  // (les suppressions déjà parties côté serveur, elles, aboutissent).
  useEffect(() => {
    const pending = timers.current;
    return () => {
      for (const timer of pending.values()) clearTimeout(timer);
      pending.clear();
    };
  }, []);

  return { pendingIds, remove };
}
