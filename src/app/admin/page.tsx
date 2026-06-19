import { auth } from '@clerk/nextjs/server'

import prisma from '@/lib/prisma'
import { getProducts } from '@/app/actions/productActions'
import { ProductGrid } from '@/components/admin/products'
import { Suspense } from 'react'

export default async function AdminPage() {
  // Le middleware protège déjà `/admin`, mais on revérifie côté serveur pour
  // garantir l'accès même si la config du matcher change. L'inscription Clerk
  // étant désactivée, tout utilisateur connu en base est autorisé.
  const { userId: clerkId, redirectToSignIn } = await auth()
  if (!clerkId) return redirectToSignIn()

  const user = await prisma.user.findUnique({ where: { clerkId } })
  if (!user) return redirectToSignIn()

  const products = await getProducts()

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <Suspense fallback={<div>Chargement...</div>}>
        <ProductGrid initialProducts={products.success ? products.data : []} />
      </Suspense>
    </div>
  )
}
