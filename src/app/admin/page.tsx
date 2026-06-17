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
     <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div className="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  )
}
