'use server'

import type { z } from 'zod'

import prisma from '@/lib/prisma'
import { uploadImage, deleteImage } from '@/lib/blob'
import { ActionResult, ok, fail } from '@/lib/action-result'
import {
  createProductSchema,
  updateProductSchema,
  productIdSchema,
} from '@/lib/validations/product'
import type { Product } from '../generated/prisma/client'

export async function createProduct(formData: FormData): Promise<ActionResult<Product>> {
  const input = createProductSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description') ?? undefined,
    email: formData.get('email'),
    image: pickImage(formData),
  })
  if (!input.success) return fail(firstError(input.error))

  const { name, description, email, image } = input.data

  const user = await prisma.user.findFirst({ where: { email } })
  if (!user) return fail('Utilisateur introuvable')

  const imageUrl = image ? await uploadImage(image) : undefined

  const product = await prisma.product.create({
    data: { name, description, imageUrl, userId: user.id },
  })

  return ok(product)
}

export async function updateProduct(formData: FormData): Promise<ActionResult<Product>> {
  const input = updateProductSchema.safeParse({
    id: formData.get('id'),
    name: formData.get('name'),
    description: formData.get('description') ?? undefined,
    image: pickImage(formData),
  })
  if (!input.success) return fail(firstError(input.error))

  const { id, name, description, image } = input.data

  const existing = await prisma.product.findUnique({ where: { id } })
  if (!existing) return fail('Produit introuvable')

  let imageUrl = existing.imageUrl
  if (image) {
    imageUrl = await uploadImage(image)
    await deleteImage(existing.imageUrl)
  }

  const product = await prisma.product.update({
    where: { id },
    data: { name, description, imageUrl },
  })

  return ok(product)
}

export async function deleteProduct(formData: FormData): Promise<ActionResult> {
  const input = productIdSchema.safeParse(formData.get('id'))
  if (!input.success) return fail(firstError(input.error))

  const existing = await prisma.product.findUnique({ where: { id: input.data } })
  if (!existing) return fail('Produit introuvable')

  await prisma.product.delete({ where: { id: existing.id } })
  await deleteImage(existing.imageUrl)

  return ok()
}

export async function getProduct(id: string): Promise<ActionResult<Product>> {
  const input = productIdSchema.safeParse(id)
  if (!input.success) return fail(firstError(input.error))

  const product = await prisma.product.findUnique({ where: { id: input.data } })
  if (!product) return fail('Produit introuvable')

  return ok(product)
}

export async function getProducts(): Promise<ActionResult<Product[]>> {
  const products = await prisma.product.findMany({ orderBy: { name: 'asc' } })
  return ok(products)
}

/** Champ image vide dans FormData (File de taille 0) => undefined. */
function pickImage(formData: FormData): File | undefined {
  const file = formData.get('image')
  return file instanceof File && file.size > 0 ? file : undefined
}

function firstError(error: z.ZodError): string {
  return error.issues[0]?.message ?? 'Données invalides'
}
