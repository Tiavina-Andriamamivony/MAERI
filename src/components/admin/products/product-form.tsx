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

/**
 * Champs texte du formulaire, validés côté client par `createProductSchema`.
 * L'image est gérée à part (input fichier non contrôlable par RHF) et le
 * serveur revalide l'ensemble — la validation zod reste la source de vérité.
 */
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
}: {
  title: string
  description: string
  /** Produit à éditer ; absent en création. */
  product?: Product
  submitLabel: string
  /** Server action recevant le `FormData` assemblé. */
  action: (formData: FormData) => Promise<ActionResult<Product>>
  /** Appelé avec le produit persisté en cas de succès. */
  onSuccess: (product: Product) => void
  onCancel: () => void
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

  const { isSubmitting } = form.formState

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
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="animate-spin" />}
            {submitLabel}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
