import { auth } from "@clerk/nextjs/server";

import getArticles from "@/app/actions/articleActions";
import getClients from "@/app/actions/clientActions";
import prisma from "@/lib/prisma";
import ArticlesTable from "@/components/admin/analyse/articles-table";
import ClientsTable from "@/components/admin/analyse/clients-table";
import ImportSection from "@/components/admin/analyse/import-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Page protégée par auth (Clerk) : jamais prérendue en statique. La rendre
// dynamique évite aussi le « CSR bailout » du `useSearchParams` de la sidebar.
export const dynamic = "force-dynamic";

export default async function DataAnalysesPage() {
  const { userId: clerkId, redirectToSignIn } = await auth();
  if (!clerkId) return redirectToSignIn();

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) return redirectToSignIn();

  const [clients, articles] = await Promise.all([getClients(), getArticles()]);

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Analyses de données</h1>
        <p className="text-sm text-muted-foreground">
          Importez un fichier Excel pour mettre à jour les clients et les
          articles, puis explorez les données ci-dessous.
        </p>
      </div>

      <ImportSection />

      <Tabs defaultValue="clients" className="w-full">
        <TabsList>
          <TabsTrigger value="clients">Clients ({clients.length})</TabsTrigger>
          <TabsTrigger value="articles">
            Articles ({articles.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="clients">
          <ClientsTable clients={clients} />
        </TabsContent>
        <TabsContent value="articles">
          <ArticlesTable articles={articles} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
