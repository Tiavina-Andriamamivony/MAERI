import { Product_type } from "@/app/generated/prisma/enums"
import { PRODUCT_TYPES } from "@/lib/product-types"

// Libellé par type, dérivé de PRODUCT_TYPES pour rester aligné avec les pages publiques.
export const TYPE_LABELS: Record<Product_type, string> = Object.fromEntries(
  PRODUCT_TYPES.map((meta) => [meta.type, meta.label]),
) as Record<Product_type, string>

// Dégradé de secours affiché quand un produit n'a pas d'image (hôtes distants bloqués en dev).
export const TYPE_COVER: Record<Product_type, string> = {
  CONSTRUCTION_MATERIALS: "from-brand/70 to-brand/20",
  INDUSTRIAL_PIPES: "from-foreground/60 to-foreground/15",
  SPECIALIZED_EQUIPMENT: "from-brand/50 to-foreground/20",
}
