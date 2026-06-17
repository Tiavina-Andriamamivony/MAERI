"use client"

import { useState } from "react"
import { PlusIcon } from "lucide-react"

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type ProductType =
  | "CONSTRUCTION_MATERIALS"
  | "INDUSTRIAL_PIPES"
  | "SPECIALIZED_EQUIPMENT"

type Product = {
  id: string
  name: string
  description: string
  type: ProductType
  imageUrl?: string
}

const TYPE_LABELS: Record<ProductType, string> = {
  CONSTRUCTION_MATERIALS: "Matériaux de construction",
  INDUSTRIAL_PIPES: "Tuyaux industriels",
  SPECIALIZED_EQUIPMENT: "Équipements spécialisés",
}

// Dégradé de marque par type, utilisé comme couverture quand le produit n'a
// pas d'image (le réseau bloque les hôtes d'images distants).
const TYPE_COVER: Record<ProductType, string> = {
  CONSTRUCTION_MATERIALS: "from-brand/70 to-brand/20",
  INDUSTRIAL_PIPES: "from-foreground/60 to-foreground/15",
  SPECIALIZED_EQUIPMENT: "from-brand/50 to-foreground/20",
}

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Roulement à billes SKF 6204",
    description:
      "Roulement rigide à une rangée de billes, étanche, pour moteurs et pompes industrielles.",
    type: "SPECIALIZED_EQUIPMENT",
  },
  {
    id: "2",
    name: "Tuyau PVC pression Ø110",
    description:
      "Tuyau PVC haute pression pour adduction d'eau et réseaux d'assainissement, longueur 6 m.",
    type: "INDUSTRIAL_PIPES",
  },
  {
    id: "3",
    name: "Ciment Portland CEM II 50 kg",
    description:
      "Ciment polyvalent pour béton, mortier et chapes. Sac de 50 kg, qualité construction.",
    type: "CONSTRUCTION_MATERIALS",
  },
]

export function ProductCards() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS)
  const [editing, setEditing] = useState<Product | null>(null)
  const [creating, setCreating] = useState(false)

  function handleUpdate(updated: Product) {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
    setEditing(null)
  }

  function handleCreate(created: Product) {
    setProducts((prev) => [...prev, created])
    setCreating(false)
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
          <Card key={product.id} className="relative mx-auto w-full max-w-sm pt-0">
            <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
            <ProductCover product={product} />
            <CardHeader>
              <CardAction>
                <Badge variant="secondary">{TYPE_LABELS[product.type]}</Badge>
              </CardAction>
              <CardTitle>{product.name}</CardTitle>
              <CardDescription>{product.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button className="w-full" onClick={() => setEditing(product)}>
                Modifier
              </Button>
            </CardFooter>
          </Card>
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
              onSubmit={handleUpdate}
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
              onSubmit={handleCreate}
              onCancel={() => setCreating(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

function ProductCover({ product }: { product: Product }) {
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

function ProductForm({
  title,
  description,
  product,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  title: string
  description: string
  product?: Product
  submitLabel: string
  onSubmit: (product: Product) => void
  onCancel: () => void
}) {
  const [name, setName] = useState(product?.name ?? "")
  const [productDescription, setProductDescription] = useState(
    product?.description ?? "",
  )
  const [type, setType] = useState<ProductType>(
    product?.type ?? "CONSTRUCTION_MATERIALS",
  )
  const [imageUrl, setImageUrl] = useState<string | undefined>(product?.imageUrl)

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) {
      setImageUrl(URL.createObjectURL(file))
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    onSubmit({
      id: product?.id ?? crypto.randomUUID(),
      name,
      description: productDescription,
      type,
      imageUrl,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="product-image">Image</Label>
          {imageUrl && (
            <div
              className="aspect-video w-full rounded-md bg-muted bg-contain bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${imageUrl})` }}
            />
          )}
          <Input
            id="product-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="product-name">Nom</Label>
          <Input
            id="product-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="product-description">Description</Label>
          <Textarea
            id="product-description"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="product-type">Type</Label>
          <Select value={type} onValueChange={(v) => setType(v as ProductType)}>
            <SelectTrigger id="product-type" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(TYPE_LABELS) as ProductType[]).map((t) => (
                <SelectItem key={t} value={t}>
                  {TYPE_LABELS[t]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </DialogFooter>
    </form>
  )
}
