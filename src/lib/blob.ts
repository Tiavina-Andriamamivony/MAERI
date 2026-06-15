import { put, del } from '@vercel/blob'

export async function uploadImage(file: File): Promise<string> {
  const blob = await put(file.name, file, {
    access: 'public',
    addRandomSuffix: true,
  })
  return blob.url
}

export async function deleteImage(imageUrl: string | null | undefined): Promise<void> {
  if (!imageUrl) return
  try {
    await del(imageUrl)
  } catch {
    // Best-effort : une mutation produit ne doit pas échouer parce que le blob
    // a déjà disparu ou est hébergé ailleurs.
  }
}
