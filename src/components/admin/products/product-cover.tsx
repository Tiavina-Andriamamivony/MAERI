import type { Product } from "@/app/generated/prisma/client"

import { TYPE_COVER } from "./product-type-meta"

/**
 * Couverture d'une carte produit : l'image du produit si elle existe, sinon un
 * dégradé de marque dérivé du type. La superposition sombre est gérée par la
 * carte parente, pas ici.
 */
export function ProductCover({ product }: { product: Product }) {
  if (product.imageUrl) {
    return (
      <div
        className="relative z-20 aspect-video w-full rounded-t-xl bg-muted bg-contain bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${product.imageUrl})` }}
      />
    )
  }

  return (
    <div
      className={`relative z-20 aspect-video w-full rounded-t-xl bg-gradient-to-br ${TYPE_COVER[product.type]}`}
    />
  )
}
