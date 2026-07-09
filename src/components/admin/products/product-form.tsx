"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import type { Product } from "@/app/generated/prisma/client"
import { Product_type } from "@/app/generated/prisma/enums"
import type { ActionResult } from "@/lib/action-result"
import { createProductSchema } from "@/lib/validations/product"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

import { TYPE_LABELS } from "./product-type-meta"

// Champs texte validés côté client ; l'image est gérée à part (input fichier
// non contrôlable par RHF) et le serveur revalide tout via zod.
type ProductFormValues = {
  name: string
  description?: string
  type: Product_type
}

const TEXT_FIELDS_SCHEMA = createProductSchema.omit({ image: true })

export function ProductForm({
  title,
  description,
  product,
  submitLabel,
  action,
  onSuccess,
  onCancel,
  onDelete,
  onDeleted,
}: {
  title: string
  description: string
  product?: Product
  submitLabel: string
  action: (formData: FormData) => Promise<ActionResult<Product>>
  onSuccess: (product: Product) => void
  onCancel: () => void
  // Fournie uniquement en édition ; sans elle, le bouton « Supprimer » n'apparaît pas.
  onDelete?: (formData: FormData) => Promise<ActionResult>
  onDeleted?: (product: Product) => void
}) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(TEXT_FIELDS_SCHEMA),
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      type: product?.type ?? Product_type.CONSTRUCTION_MATERIALS,
    },
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(
    product?.imageUrl ?? undefined,
  )
  const [isDeleting, setIsDeleting] = useState(false)

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const onSubmit = form.handleSubmit(async (values) => {
    const formData = new FormData()
    if (product) formData.set("id", product.id)
    formData.set("name", values.name)
    formData.set("description", values.description ?? "")
    formData.set("type", values.type)
    if (imageFile) formData.set("image", imageFile)

    const result = await action(formData)
    if (!result.success) {
      toast.error(result.error)
      return
    }
    onSuccess(result.data)
  })

  async function handleDelete() {
    if (!product || !onDelete) return
    setIsDeleting(true)
    const formData = new FormData()
    formData.set("id", product.id)
    const result = await onDelete(formData)
    setIsDeleting(false)
    if (!result.success) {
      toast.error(result.error)
      return
    }
    onDeleted?.(product)
  }

  const { isSubmitting } = form.formState
  const canDelete = Boolean(product && onDelete)

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <FormItem>
            <FormLabel htmlFor="product-image">Image</FormLabel>
            <p className="text-muted-foreground text-sm">
              Format 16:9 recommandé (ex. 1280×720 px), 5 Mo maximum.
            </p>
            {previewUrl && (
              <div
                className="aspect-video w-full rounded-md bg-muted bg-contain bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${previewUrl})` }}
              />
            )}
            <Input
              id="product-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </FormItem>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(Object.keys(TYPE_LABELS) as Product_type[]).map((t) => (
                      <SelectItem key={t} value={t}>
                        {TYPE_LABELS[t]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting || isDeleting}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting || isDeleting}>
            {isSubmitting && <Loader2 className="animate-spin" />}
            {submitLabel}
          </Button>
        </DialogFooter>

        {canDelete && (
          <div className="mt-4 border-t border-border pt-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="destructive"
                  className="w-full"
                  disabled={isSubmitting || isDeleting}
                >
                  {isDeleting && <Loader2 className="animate-spin" />}
                  Supprimer le produit
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Supprimer ce produit ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. Le produit «&nbsp;
                    {product?.name}&nbsp;» sera définitivement supprimé de la
                    base de données.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>
                    Annuler
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-white hover:bg-destructive/90"
                  >
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </form>
    </Form>
  )
}
