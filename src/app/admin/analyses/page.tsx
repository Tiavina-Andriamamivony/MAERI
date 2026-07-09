// Sous le layout admin (sidebar avec useSearchParams) : on désactive le prérendu statique.
export const dynamic = 'force-dynamic'

export default function AnalysesPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <h1 className="text-2xl font-semibold">Analyses</h1>
      <p className="text-muted-foreground text-sm">
        Bienvenue sur le tableau de bord des analyses.
      </p>
    </div>
  )
}