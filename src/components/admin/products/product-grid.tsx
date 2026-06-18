"use client"

import { useState } from "react"
import { PlusIcon } from "lucide-react"
import { toast } from "sonner"

import type { Product } from "@/app/generated/prisma/client"
import { createProduct, updateProduct } from "@/app/actions/productActions"
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

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Produits</h1>
          <p className="text-muted-foreground text-sm">
            Aperçu des produits, par type. Cliquez sur « Modifier » pour éditer.
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

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onEdit={setEditing} />
        ))}
      </div>

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
