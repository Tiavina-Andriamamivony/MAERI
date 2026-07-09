import type { Product } from "@/app/generated/prisma/client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { ProductCover } from "./product-cover"
import { TYPE_LABELS } from "./product-type-meta"

// Carte présentationnelle d'un produit ; remonte la demande d'édition via `onEdit`.
export function ProductCard({
  product,
  onEdit,
}: {
  product: Product
  onEdit: (product: Product) => void
}) {
  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
      <ProductCover product={product} />
      <CardHeader>
        <CardAction>
          <Badge variant="secondary">{TYPE_LABELS[product.type]}</Badge>
        </CardAction>
        <CardTitle>{product.name}</CardTitle>
        {product.description && (
          <CardDescription>{product.description}</CardDescription>
        )}
      </CardHeader>
      <CardFooter>
        <Button className="w-full" onClick={() => onEdit(product)}>
          Modifier
        </Button>
      </CardFooter>
    </Card>
  )
}
