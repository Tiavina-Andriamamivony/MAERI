import { put, del } from '@vercel/blob'

export async function uploadImage(file: File): Promise<string> {
  const blob = await put(file.name, file, {
    access: 'public',
    addRandomSuffix: true,
  })
  return blob.url
}

/**
 * Stocke un PDF généré (proforma) dans Vercel Blob et renvoie son URL
 * publique. `addRandomSuffix` évite les collisions entre deux proformas qui
 * porteraient le même nom de fichier.
 */
export async function uploadPdf(
  buffer: Buffer,
  filename: string,
): Promise<string> {
  const blob = await put(filename, buffer, {
    access: 'public',
    addRandomSuffix: true,
    contentType: 'application/pdf',
  })
  return blob.url
}

export async function deleteBlob(blobUrl: string | null | undefined): Promise<void> {
  if (!blobUrl) return
  try {
    await del(blobUrl)
  } catch {
    // Best-effort : la suppression d'un blob ne doit pas faire échouer
    // l'opération principale si le blob a déjà disparu.
  }
}
