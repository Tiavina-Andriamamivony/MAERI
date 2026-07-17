"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

import type { ActionResult } from "@/lib/action-result";

/**
 * Encapsule la persistance d'une ligne (création ou mise à jour) : appelle la
 * server action, affiche un toast selon le résultat et expose l'état d'envoi.
 * Les composants de tableau n'ont ainsi pas à gérer eux-mêmes ce mécanisme.
 *
 * - `isSaving` : vrai pendant l'appel réseau.
 * - `run(formData, message)` : renvoie `true` si l'enregistrement a réussi.
 */
export function useRowMutation<Row>(
  action?: (formData: FormData) => Promise<ActionResult<Row>>,
) {
  const [isSaving, setIsSaving] = useState(false);

  const run = useCallback(
    async (formData: FormData, successMessage: string): Promise<boolean> => {
      if (!action) return false;

      setIsSaving(true);
      const result = await action(formData);
      setIsSaving(false);

      if (!result.success) {
        toast.error(result.error);
        return false;
      }
      toast.success(successMessage);
      return true;
    },
    [action],
  );

  return { run, isSaving };
}
