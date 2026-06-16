import { z } from 'zod'

import { Product_type } from '@/app/generated/prisma/enums'

const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
] as const

const optionalImage = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_IMAGE_SIZE, 'L’image ne doit pas dépasser 5 Mo')
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type as (typeof ACCEPTED_IMAGE_TYPES)[number]),
    'Format accepté : JPEG, PNG, WebP ou GIF',
  )
  .optional()

export const createProductSchema = z.object({
  name: z.string().trim().min(1, 'Le nom est requis').max(120, 'Nom trop long'),
  description: z.string().trim().max(2000, 'Description trop longue').optional(),
  type: z.nativeEnum(Product_type, { errorMap: () => ({ message: 'Type de produit invalide' }) }),
  image: optionalImage,
})

export const updateProductSchema = createProductSchema
  .extend({ id: z.string().uuid('Identifiant produit invalide') })

export const productIdSchema = z.string().uuid('Identifiant produit invalide')

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
