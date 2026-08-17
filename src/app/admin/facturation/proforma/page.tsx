import { notFound } from "next/navigation";

import getProformas from "@/app/actions/proformaActions";
import getClients from "@/app/actions/clientActions";
import getArticles from "@/app/actions/articleActions";
import { requireAdmin } from "@/lib/auth-guard";
import { ProformaManager } from "@/components/admin/facturation/proforma-manager";

// Page protégée par auth (Clerk) : jamais prérendue en statique.
export const dynamic = "force-dynamic";

export default async function ProformaPage() {
  // Le middleware protège déjà `/admin` ; on revérifie côté serveur par sécurité.
  const admin = await requireAdmin();
  if (!admin.success) notFound();

  const [proformas, clients, articles] = await Promise.all([
    getProformas(),
    getClients(),
    getArticles(),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Facture proforma</h1>
        <p className="text-sm text-muted-foreground">
          Générez une facture proforma en PDF à partir du template, avec aperçu
          avant sauvegarde. Le document est figé après enregistrement.
        </p>
      </div>

      <ProformaManager
        proformas={proformas}
        clients={clients}
        articles={articles}
      />
    </div>
  );
}
