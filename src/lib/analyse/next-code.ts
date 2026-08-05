import prisma from "@/lib/prisma";

import {
  ARTICLE_REFERENCE_PREFIX,
  articleSequenceOf,
  formatArticleReference,
} from "./codes";

/** Premier identifiant attribué quand la table est encore vide. */
const FIRST_SEQUENCE = 1;

/** Code d'erreur Prisma d'une violation de contrainte d'unicité. */
const UNIQUE_VIOLATION_CODE = "P2002";

/**
 * Nombre de tentatives de création. Une seule ne suffit pas : entre le calcul
 * du prochain identifiant et l'insertion, une autre création peut avoir pris la
 * place et l'index unique rejette alors la ligne.
 */
const MAX_ATTEMPTS = 3;

/** Prochain code client libre : le plus grand code existant, plus un. */
export async function nextClientCode(): Promise<number> {
  const { _max } = await prisma.client.aggregate({
    _max: { code_client: true },
  });

  return (_max.code_client ?? 0) + FIRST_SEQUENCE;
}

/**
 * Prochaine référence article libre, au format « ART-0001 ».
 *
 * Les références hors format (saisies à la main, issues d'un fichier tiers) sont
 * ignorées dans le calcul : seule la suite « ART-#### » est incrémentée. On lit
 * les références plutôt que d'utiliser `max()` en base car l'ordre alphabétique
 * cesse de suivre l'ordre numérique au-delà de 9999 (« ART-10000 » < « ART-9999 »).
 */
export async function nextArticleReference(): Promise<string> {
  const articles = await prisma.article.findMany({
    where: { reference: { startsWith: ARTICLE_REFERENCE_PREFIX } },
    select: { reference: true },
  });

  const sequences = articles
    .map((article) => articleSequenceOf(article.reference))
    .filter((sequence): sequence is number => sequence !== null);

  const lastSequence = sequences.length === 0 ? 0 : Math.max(...sequences);

  return formatArticleReference(lastSequence + FIRST_SEQUENCE);
}

function isUniqueViolation(error: unknown): boolean {
  if (typeof error !== "object" || error === null || !("code" in error)) {
    return false;
  }
  return error.code === UNIQUE_VIOLATION_CODE;
}

/**
 * Exécute une création dont la clé unique est attribuée automatiquement, en
 * réessayant si deux créations concurrentes ont visé le même identifiant.
 *
 * `create` doit calculer l'identifiant *et* insérer la ligne : c'est le recalcul
 * à chaque tentative qui permet à la seconde de viser le suivant.
 */
export async function createWithAllocatedKey<Row>(
  create: () => Promise<Row>,
): Promise<Row> {
  for (let attempt = 1; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      return await create();
    } catch (error) {
      if (!isUniqueViolation(error)) throw error;
    }
  }

  // Dernière tentative : l'échec remonte tel quel à l'appelant.
  return await create();
}
