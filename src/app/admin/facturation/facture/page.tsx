import { notFound } from "next/navigation";

import getFactures from "@/app/actions/factureActions";
import getClients from "@/app/actions/clientActions";
import getArticles from "@/app/actions/articleActions";
import { requireAdmin } from "@/lib/auth-guard";
import { FactureManager } from "@/components/admin/facturation/facture-manager";

// Page protégée par auth (Clerk) : jamais prérendue en statique.
export const dynamic = "force-dynamic";

export default async function FacturePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  // Le middleware protège déjà `/admin` ; on revérifie côté serveur par sécurité.
  const admin = await requireAdmin();
  if (!admin.success) notFound();

  const params = await searchParams;

  const [factures, clients, articles] = await Promise.all([
    getFactures(),
    getClients(),
    getArticles(),
  ]);

  // Données pré-remplies depuis un proforma (via query params).
  // Filtrer les valeurs undefined pour satisfaire le type Record<string, string>.
  const initialData =
    params && Object.keys(params).length > 0
      ? Object.fromEntries(
          Object.entries(params).filter(
            (entry): entry is [string, string] => entry[1] !== undefined,
          ),
        )
      : undefined;

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Facture</h1>
        <p className="text-sm text-muted-foreground">
          Générez une facture en PDF à partir du template, avec aperçu
          avant sauvegarde. Le document est figé après enregistrement.
        </p>
      </div>

      <FactureManager
        factures={factures}
        clients={clients}
        articles={articles}
        initialData={initialData}
      />
    </div>
  );
}
