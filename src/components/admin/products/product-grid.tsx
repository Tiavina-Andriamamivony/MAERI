"use client"

import { useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { PackageOpenIcon, PlusIcon } from "lucide-react"
import { toast } from "sonner"

import type { Product } from "@/app/generated/prisma/client"
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/app/actions/productActions"
import { getProductTypeBySlug } from "@/lib/product-types"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"

import { ProductCard } from "./product-card"
import { ProductForm } from "./product-form"

/**
 * Conteneur des cartes produit : détient la liste affichée et orchestre les
 * dialogs de création / édition. La persistance vit dans les server actions ;
 * ici on se contente de refléter leur résultat dans l'état local.
 */
export function ProductGrid({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [editing, setEditing] = useState<Product | null>(null)
  const [creating, setCreating] = useState(false)

  // Filtre actif piloté par la sidebar via `?type=<slug>`. Slug inconnu ou
  // absent => on affiche tous les produits.
  const searchParams = useSearchParams()
  const activeType = getProductTypeBySlug(searchParams.get("type") ?? "")

  const visibleProducts = useMemo(
    () =>
      activeType
        ? products.filter((p) => p.type === activeType.type)
        : products,
    [products, activeType],
  )

  function handleCreated(created: Product) {
    setProducts((prev) => [...prev, created])
    setCreating(false)
    toast.success("Produit ajouté.")
  }

  function handleUpdated(updated: Product) {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
    setEditing(null)
    toast.success("Produit mis à jour.")
  }

  function handleDeleted(deleted: Product) {
    setProducts((prev) => prev.filter((p) => p.id !== deleted.id))
    setEditing(null)
    toast.success("Produit supprimé.")
  }

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            {activeType ? activeType.title : "Produits"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {activeType
              ? activeType.lede
              : "Aperçu des produits, par type. Cliquez sur « Modifier » pour éditer."}
          </p>
        </div>
        <Button
          size="icon"
          onClick={() => setCreating(true)}
          aria-label="Ajouter un produit"
        >
          <PlusIcon />
        </Button>
      </div>

      {visibleProducts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={setEditing}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
          <PackageOpenIcon className="text-muted-foreground size-8" />
          <div className="space-y-1">
            <p className="font-medium">
              {activeType
                ? `Aucun produit dans « ${activeType.label} » pour le moment`
                : "Aucun produit pour le moment"}
            </p>
            <p className="text-muted-foreground mx-auto max-w-md text-sm">
              Cette catégorie est encore vide. Ajoutez un premier produit pour
              le voir apparaître ici.
            </p>
          </div>
          <Button onClick={() => setCreating(true)}>
            <PlusIcon />
            Ajouter un produit
          </Button>
        </div>
      )}

      {/* Dialog d'édition */}
      <Dialog
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
      >
        <DialogContent>
          {editing && (
            <ProductForm
              key={editing.id}
              title="Modifier le produit"
              description="Mettez à jour les informations du produit, puis enregistrez."
              product={editing}
              submitLabel="Enregistrer"
              action={updateProduct}
              onSuccess={handleUpdated}
              onCancel={() => setEditing(null)}
              onDelete={deleteProduct}
              onDeleted={handleDeleted}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog d'ajout */}
      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent>
          {creating && (
            <ProductForm
              title="Ajouter un produit"
              description="Renseignez les informations du nouveau produit."
              submitLabel="Ajouter"
              action={createProduct}
              onSuccess={handleCreated}
              onCancel={() => setCreating(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
