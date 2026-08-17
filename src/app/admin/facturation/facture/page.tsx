import { notFound } from "next/navigation";

import { requireAdmin } from "@/lib/auth-guard";

// Page protégée par auth (Clerk) : jamais prérendue en statique. La rendre
// dynamique évite aussi le « CSR bailout » du `useSearchParams` de la sidebar.
export const dynamic = "force-dynamic";

export default async function FacturePage() {
  // Le middleware protège déjà `/admin` ; on revérifie côté serveur par sécurité.
  const admin = await requireAdmin();
  if (!admin.success) notFound();

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <h1 className="text-2xl font-semibold">Voici la page facture</h1>
    </div>
  );
}
