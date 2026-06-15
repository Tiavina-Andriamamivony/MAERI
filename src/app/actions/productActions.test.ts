import { describe, it, expect, vi, beforeEach } from 'vitest'

import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getProducts,
} from './productActions'

vi.mock('@/lib/prisma', () => ({
  default: {
    user: { findFirst: vi.fn() },
    product: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
    },
  },
}))

vi.mock('@/lib/blob', () => ({
  uploadImage: vi.fn(),
  deleteImage: vi.fn(),
}))

import prisma from '@/lib/prisma'
import { uploadImage, deleteImage } from '@/lib/blob'

const UUID = '11111111-1111-1111-1111-111111111111'

function form(fields: Record<string, string | File>): FormData {
  const fd = new FormData()
  for (const [key, value] of Object.entries(fields)) fd.set(key, value)
  return fd
}

function imageFile(type = 'image/png', size = 10): File {
  return new File([new Uint8Array(size)], 'photo.png', { type })
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('createProduct', () => {
  it('rejette un nom vide', async () => {
    const res = await createProduct(form({ name: '', email: 'a@b.com' }))
    expect(res).toEqual({ success: false, error: 'Le nom est requis' })
    expect(prisma.user.findFirst).not.toHaveBeenCalled()
  })

  it('rejette un email invalide', async () => {
    const res = await createProduct(form({ name: 'Roulement', email: 'pasunemail' }))
    expect(res).toEqual({ success: false, error: 'Email invalide' })
  })

  it('rejette une image trop lourde', async () => {
    const big = new File([new Uint8Array(6 * 1024 * 1024)], 'big.png', { type: 'image/png' })
    const res = await createProduct(form({ name: 'Roulement', email: 'a@b.com', image: big }))
    expect(res).toEqual({ success: false, error: 'L’image ne doit pas dépasser 5 Mo' })
  })

  it('rejette un mauvais type de fichier', async () => {
    const pdf = new File([new Uint8Array(10)], 'doc.pdf', { type: 'application/pdf' })
    const res = await createProduct(form({ name: 'Roulement', email: 'a@b.com', image: pdf }))
    expect(res).toEqual({ success: false, error: 'Format accepté : JPEG, PNG, WebP ou GIF' })
  })

  it('échoue si utilisateur introuvable', async () => {
    vi.mocked(prisma.user.findFirst).mockResolvedValue(null)
    const res = await createProduct(form({ name: 'Roulement', email: 'a@b.com' }))
    expect(res).toEqual({ success: false, error: 'Utilisateur introuvable' })
  })

  it('crée un produit sans image', async () => {
    vi.mocked(prisma.user.findFirst).mockResolvedValue({ id: 'user-1' } as never)
    const created = { id: UUID, name: 'Roulement', description: undefined, imageUrl: null, userId: 'user-1' }
    vi.mocked(prisma.product.create).mockResolvedValue(created as never)

    const res = await createProduct(form({ name: 'Roulement', email: 'a@b.com' }))

    expect(uploadImage).not.toHaveBeenCalled()
    expect(prisma.product.create).toHaveBeenCalledWith({
      data: { name: 'Roulement', description: undefined, imageUrl: undefined, userId: 'user-1' },
    })
    expect(res).toEqual({ success: true, data: created })
  })

  it('upload l’image puis crée le produit', async () => {
    vi.mocked(prisma.user.findFirst).mockResolvedValue({ id: 'user-1' } as never)
    vi.mocked(uploadImage).mockResolvedValue('https://blob/photo.png')
    vi.mocked(prisma.product.create).mockResolvedValue({ id: UUID } as never)

    const res = await createProduct(
      form({ name: 'Roulement', email: 'a@b.com', image: imageFile() }),
    )

    expect(uploadImage).toHaveBeenCalledOnce()
    expect(prisma.product.create).toHaveBeenCalledWith({
      data: { name: 'Roulement', description: undefined, imageUrl: 'https://blob/photo.png', userId: 'user-1' },
    })
    expect(res.success).toBe(true)
  })
})

describe('updateProduct', () => {
  it('rejette un id non-uuid', async () => {
    const res = await updateProduct(form({ id: 'abc', name: 'Roulement' }))
    expect(res).toEqual({ success: false, error: 'Identifiant produit invalide' })
  })

  it('échoue si produit introuvable', async () => {
    vi.mocked(prisma.product.findUnique).mockResolvedValue(null)
    const res = await updateProduct(form({ id: UUID, name: 'Roulement' }))
    expect(res).toEqual({ success: false, error: 'Produit introuvable' })
  })

  it('met à jour sans toucher à l’image', async () => {
    vi.mocked(prisma.product.findUnique).mockResolvedValue({ id: UUID, imageUrl: 'old' } as never)
    vi.mocked(prisma.product.update).mockResolvedValue({ id: UUID } as never)

    await updateProduct(form({ id: UUID, name: 'Nouveau' }))

    expect(uploadImage).not.toHaveBeenCalled()
    expect(deleteImage).not.toHaveBeenCalled()
    expect(prisma.product.update).toHaveBeenCalledWith({
      where: { id: UUID },
      data: { name: 'Nouveau', description: undefined, imageUrl: 'old' },
    })
  })

  it('remplace l’image et supprime l’ancienne', async () => {
    vi.mocked(prisma.product.findUnique).mockResolvedValue({ id: UUID, imageUrl: 'old-url' } as never)
    vi.mocked(uploadImage).mockResolvedValue('new-url')
    vi.mocked(prisma.product.update).mockResolvedValue({ id: UUID } as never)

    await updateProduct(form({ id: UUID, name: 'Nouveau', image: imageFile() }))

    expect(uploadImage).toHaveBeenCalledOnce()
    expect(deleteImage).toHaveBeenCalledWith('old-url')
    expect(prisma.product.update).toHaveBeenCalledWith({
      where: { id: UUID },
      data: { name: 'Nouveau', description: undefined, imageUrl: 'new-url' },
    })
  })
})

describe('deleteProduct', () => {
  it('rejette un id non-uuid', async () => {
    const res = await deleteProduct(form({ id: 'nope' }))
    expect(res).toEqual({ success: false, error: 'Identifiant produit invalide' })
  })

  it('échoue si produit introuvable', async () => {
    vi.mocked(prisma.product.findUnique).mockResolvedValue(null)
    const res = await deleteProduct(form({ id: UUID }))
    expect(res).toEqual({ success: false, error: 'Produit introuvable' })
  })

  it('supprime le produit et son image', async () => {
    vi.mocked(prisma.product.findUnique).mockResolvedValue({ id: UUID, imageUrl: 'url' } as never)
    vi.mocked(prisma.product.delete).mockResolvedValue({ id: UUID } as never)

    const res = await deleteProduct(form({ id: UUID }))

    expect(prisma.product.delete).toHaveBeenCalledWith({ where: { id: UUID } })
    expect(deleteImage).toHaveBeenCalledWith('url')
    expect(res).toEqual({ success: true, data: undefined })
  })
})

describe('getProduct', () => {
  it('rejette un id non-uuid', async () => {
    const res = await getProduct('abc')
    expect(res).toEqual({ success: false, error: 'Identifiant produit invalide' })
  })

  it('échoue si produit introuvable', async () => {
    vi.mocked(prisma.product.findUnique).mockResolvedValue(null)
    const res = await getProduct(UUID)
    expect(res).toEqual({ success: false, error: 'Produit introuvable' })
  })

  it('renvoie le produit', async () => {
    const product = { id: UUID, name: 'Roulement' }
    vi.mocked(prisma.product.findUnique).mockResolvedValue(product as never)
    const res = await getProduct(UUID)
    expect(res).toEqual({ success: true, data: product })
  })
})

describe('getProducts', () => {
  it('renvoie la liste triée par nom', async () => {
    const products = [{ id: UUID, name: 'Roulement' }]
    vi.mocked(prisma.product.findMany).mockResolvedValue(products as never)

    const res = await getProducts()

    expect(prisma.product.findMany).toHaveBeenCalledWith({ orderBy: { name: 'asc' } })
    expect(res).toEqual({ success: true, data: products })
  })
})
