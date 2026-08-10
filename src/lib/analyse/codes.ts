/**
 * Formats des identifiants attribués automatiquement dans la section Analyses :
 * le code client (« 001 ») et la référence article (« ART-0001 »).
 *
 * Ce module est volontairement pur (aucun accès base) pour rester testable et
 * utilisable des deux côtés de la frontière serveur/client : l'attribution du
 * prochain identifiant vit dans `next-code.ts`.
 */

/** Largeur minimale du code client : 1 devient « 001 ». */
const CLIENT_CODE_WIDTH = 3;

/** Préfixe des références d'articles attribuées automatiquement. */
export const ARTICLE_REFERENCE_PREFIX = "ART-";

/** Largeur minimale du numéro de séquence d'une référence : « ART-0001 ». */
const ARTICLE_SEQUENCE_WIDTH = 4;

const ARTICLE_REFERENCE_PATTERN = /^ART-(\d+)$/;

/**
 * Met en forme un code client sur au moins trois chiffres (1 → « 001 »).
 * Au-delà de 999, le code s'élargit naturellement (1000 → « 1000 ») : la valeur
 * n'est jamais tronquée.
 */
export function formatClientCode(code: number): string {
  return String(code).padStart(CLIENT_CODE_WIDTH, "0");
}

/** Met en forme un numéro de séquence en référence article (4 → « ART-0004 »). */
export function formatArticleReference(sequence: number): string {
  return (
    ARTICLE_REFERENCE_PREFIX +
    String(sequence).padStart(ARTICLE_SEQUENCE_WIDTH, "0")
  );
}

/**
 * Numéro de séquence porté par une référence au format attribué
 * automatiquement, ou `null` pour toute autre forme (référence fournisseur
 * saisie à la main, import d'un fichier tiers…).
 */
export function articleSequenceOf(reference: string): number | null {
  const digits = ARTICLE_REFERENCE_PATTERN.exec(reference)?.[1];
  return digits === undefined ? null : Number(digits);
}
