import { auth } from '@clerk/nextjs/server'

import prisma from '@/lib/prisma'

export default async function AdminPage() {
  // Le middleware protège déjà `/admin`, mais on revérifie côté serveur pour
  // garantir l'accès même si la config du matcher change. L'inscription Clerk
  // étant désactivée, tout utilisateur connu en base est autorisé.
  const { userId: clerkId, redirectToSignIn } = await auth()
  if (!clerkId) return redirectToSignIn()

  const user = await prisma.user.findUnique({ where: { clerkId } })
  if (!user) return redirectToSignIn()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold">Admin Page</h1>
      <p className="mt-4 text-lg">Welcome to the admin dashboard.</p>
    </div>
  )
}
