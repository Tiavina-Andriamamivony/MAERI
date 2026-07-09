import { Product_type } from "@/app/generated/prisma/enums";

// Métadonnées éditoriales d'un type de produit. Le `slug` sert d'URL dans
// `/products/list/[type]` et reprend les slugs des pages produits existantes.
export type ProductTypeMeta = {
  slug: string;
  type: Product_type;
  label: string;
  title: string;
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

export function getProductTypeBySlug(slug: string): ProductTypeMeta | undefined {
  return PRODUCT_TYPES.find((entry) => entry.slug === slug);
}

export function productListPath(type: Product_type): string {
  const meta = PRODUCT_TYPES.find((entry) => entry.type === type);
  return `/products/list/${meta?.slug ?? ""}`;
}
