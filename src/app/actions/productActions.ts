'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { uploadImage, deleteBlob } from '@/lib/blob'
import { ok, fail, notFound, type ActionResult as AR } from '@/lib/action-result'
import { requireAdmin } from '@/lib/auth-guard'
import { firstError } from '@/lib/validations/first-error'
import { productListPath } from '@/lib/product-types'
import {
  createProductSchema,
  updateProductSchema,
  productIdSchema,
} from '@/lib/validations/product'
import type { Product, Product_type } from '../generated/prisma/client'

export async function createProduct(formData: FormData): Promise<AR<Product>> {
  const auth = await requireAdmin()
  if (!auth.success) return auth

  const input = createProductSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description') ?? undefined,
    type: formData.get('type'),
    image: pickImage(formData),
  })
  if (!input.success) return fail(firstError(input.error), 422, 'VALIDATION_ERROR')

  const { name, description, type, image } = input.data

  const imageUrl = image ? await uploadImage(image) : undefined

  const product = await prisma.product.create({
    data: { name, description, type, imageUrl, userId: auth.data.id },
  })

  console.log('[product] Produit créé #%s (%s)', product.id, product.name)
  revalidatePath(productListPath(product.type))

  return ok(product)
}

export async function updateProduct(formData: FormData): Promise<AR<Product>> {
  const auth = await requireAdmin()
  if (!auth.success) return auth

  const input = updateProductSchema.safeParse({
    id: formData.get('id'),
    name: formData.get('name'),
    description: formData.get('description') ?? undefined,
    type: formData.get('type'),
    image: pickImage(formData),
  })
  if (!input.success) return fail(firstError(input.error), 422, 'VALIDATION_ERROR')

  const { id, name, description, type, image } = input.data

  const existing = await prisma.product.findUnique({ where: { id } })
  if (!existing) return notFound('Produit introuvable.', 'PRODUCT_NOT_FOUND')

  let imageUrl = existing.imageUrl
  if (image) {
    imageUrl = await uploadImage(image)
    await deleteBlob(existing.imageUrl)
  }

  const product = await prisma.product.update({
    where: { id },
    data: { name, description, type, imageUrl },
  })

  console.log('[product] Produit mis à jour #%s', id)
  revalidatePath(productListPath(product.type))
  if (existing.type !== product.type) {
    revalidatePath(productListPath(existing.type))
  }

  return ok(product)
}

export async function deleteProduct(formData: FormData): Promise<AR> {
  const auth = await requireAdmin()
  if (!auth.success) return auth

  const input = productIdSchema.safeParse(formData.get('id'))
  if (!input.success) return fail(firstError(input.error), 422, 'VALIDATION_ERROR')

  const existing = await prisma.product.findUnique({ where: { id: input.data } })
  if (!existing) return notFound('Produit introuvable.', 'PRODUCT_NOT_FOUND')

  await prisma.product.delete({ where: { id: existing.id } })
  await deleteBlob(existing.imageUrl)

  console.log('[product] Produit supprimé #%s', existing.id)
  revalidatePath(productListPath(existing.type))

  return ok()
}

export async function getProduct(id: string): Promise<AR<Product>> {
  const input = productIdSchema.safeParse(id)
  if (!input.success) return fail(firstError(input.error), 422, 'VALIDATION_ERROR')

  const product = await prisma.product.findUnique({ where: { id: input.data } })
  if (!product) return notFound('Produit introuvable.', 'PRODUCT_NOT_FOUND')

  return ok(product)
}

export async function getProducts(): Promise<AR<Product[]>> {
  const products = await prisma.product.findMany({ orderBy: { name: 'asc' } })
  return ok(products)
}

export async function getProductsByProductType(
  productType: Product_type,
): Promise<AR<Product[]>> {
  const products = await prisma.product.findMany({
    where: { type: productType },
    orderBy: { name: 'asc' },
  })
  return ok(products)
}

/** Champ image vide dans FormData (File de taille 0) => undefined. */
function pickImage(formData: FormData): File | undefined {
  const file = formData.get('image')
  return file instanceof File && file.size > 0 ? file : undefined
}
