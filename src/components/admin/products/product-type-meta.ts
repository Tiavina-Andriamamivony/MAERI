import { Product_type } from "@/app/generated/prisma/enums"
import { PRODUCT_TYPES } from "@/lib/product-types"

/**
 * Étiquette lisible d'un type de produit, dérivée de la source de vérité unique
 * `PRODUCT_TYPES` (`src/lib/product-types.ts`). On ne redéclare pas les libellés
 * ici pour qu'ils restent alignés avec les pages produits publiques.
 */
export const TYPE_LABELS: Record<Product_type, string> = Object.fromEntries(
  PRODUCT_TYPES.map((meta) => [meta.type, meta.label]),
) as Record<Product_type, string>

/**
 * Dégradé de marque par type, utilisé comme couverture quand le produit n'a pas
 * d'image (le réseau bloque les hôtes d'images distants en dev).
 */
export const TYPE_COVER: Record<Product_type, string> = {
  CONSTRUCTION_MATERIALS: "from-brand/70 to-brand/20",
  INDUSTRIAL_PIPES: "from-foreground/60 to-foreground/15",
  SPECIALIZED_EQUIPMENT: "from-brand/50 to-foreground/20",
}
