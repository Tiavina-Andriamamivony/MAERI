import { Product_type } from "@/app/generated/prisma/enums";

/**
 * Métadonnées éditoriales pour chaque type de produit. La clé `slug` est la
 * partie d'URL exposée dans `/products/list/[type]` ; elle reprend volontairement
 * les slugs des pages produits statiques existantes pour rester cohérente.
 */
export type ProductTypeMeta = {
  slug: string;
  type: Product_type;
  /** Étiquette courte (kicker, nav). */
  label: string;
  /** Titre éditorial de la page liste. */
  title: string;
  /** Phrase d'accroche sous le titre. */
  lede: string;
};

export const PRODUCT_TYPES: ProductTypeMeta[] = [
  {
    slug: "construction-materials",
    type: Product_type.CONSTRUCTION_MATERIALS,
    label: "Matériaux de construction",
    title: "Matériaux de construction",
    lede: "Ciment, fer à béton, tôles et granulats — la matière première de vos chantiers, sélectionnée pour durer.",
  },
  {
    slug: "industrial-pipes",
    type: Product_type.INDUSTRIAL_PIPES,
    label: "Tuyaux industriels",
    title: "Tuyaux industriels",
    lede: "Tubes acier, PVC pression, raccords PEHD et vannes — pour vos réseaux de fluides sous pression.",
  },
  {
    slug: "specialized-equipment",
    type: Product_type.SPECIALIZED_EQUIPMENT,
    label: "Équipements spécialisés",
    title: "Équipements spécialisés",
    lede: "Roulements, courroies, moteurs et pompes — les composants techniques qui font tourner vos lignes.",
  },
];

/** Résout un slug d'URL vers ses métadonnées, ou `undefined` si inconnu. */
export function getProductTypeBySlug(slug: string): ProductTypeMeta | undefined {
  return PRODUCT_TYPES.find((entry) => entry.slug === slug);
}
