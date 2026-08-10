import { notFound } from 'next/navigation'

import { requireAdmin } from '@/lib/auth-guard'
import { getProducts } from '@/app/actions/productActions'
import { ProductGrid } from '@/components/admin/products'
import { Suspense } from 'react'

// Jamais prérendue : garde l'auth Clerk et évite le « CSR bailout » de useSearchParams.
export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  // Le middleware protège déjà `/admin` ; on revérifie côté serveur par sécurité.
  const admin = await requireAdmin()
  if (!admin.success) notFound()

  const products = await getProducts()

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <Suspense fallback={<div>Chargement...</div>}>
        <ProductGrid initialProducts={products.success ? products.data : []} />
      </Suspense>
    </div>
  )
}
