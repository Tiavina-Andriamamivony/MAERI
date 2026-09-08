export interface ActionResultSuccess<T> {
  success: true;
  data: T;
}

export interface ActionResultFailure {
  success: false;
  error: string;
  /** HTTP status code applicable à cette erreur. Présent sur les erreurs structurées (fail avec status). */
  status?: number;
  /** Code d'erreur interne pour le traitement côté front. */
  code?: string;
}

export type ActionResult<T = void> =
  | ActionResultSuccess<T>
  | ActionResultFailure;

export function ok<T = void>(data?: T): ActionResult<T> {
  return { success: true, data: data as T };
}

/**
 * Erreur structurée avec statut HTTP et code interne optionnel.
 * Utilise par les server actions pour propager des erreurs exploitables.
 */
export function fail(
  error: string,
  status?: number,
  code?: string,
): ActionResult<never> {
  return { success: false, error, status, code };
}

/** Raccourcis pour les cas d'erreur fréquents. */
export function unauthorized(
  message = "Accès refusé",
  code = "UNAUTHORIZED",
): ActionResult<never> {
  return fail(message, 401, code);
}

export function notFound(
  message = "Ressource introuvable",
  code = "NOT_FOUND",
): ActionResult<never> {
  return fail(message, 404, code);
}

export function conflict(
  message = "Conflit",
  code = "CONFLICT",
): ActionResult<never> {
  return fail(message, 409, code);
}

export function validationError(
  message = "Données invalides",
  code = "VALIDATION_ERROR",
): ActionResult<never> {
  return fail(message, 422, code);
}
