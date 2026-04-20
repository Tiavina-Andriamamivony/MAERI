import Image from "next/image";
import { CTABlock, Kicker, PageHero } from "@/components/brand";

export const metadata = {
  title: "Notre histoire",
  description:
    "L'histoire de MA-ERI Consulting, startup malgache fondée pour relier l'industrie, la formation et le digital.",
};

const chapters = [
  {
    year: "2023",
    title: "Un constat de terrain.",
    body:
      "Nos fondateurs, au contact quotidien des PME malgaches, observent une même friction : l'industrie manque de pièces, les équipes manquent de formation, et les outils numériques arrivent souvent trop tard ou mal adaptés au contexte local.",
  },
  {
    year: "2024",
    title: "Naissance à Toamasina.",
    body:
      "MA-ERI Consulting est fondée à Toamasina, principal port de Madagascar. Le choix n'est pas anodin : être au cœur des flux d'import-export et à proximité des industries qui en dépendent.",
  },
  {
    year: "2024",
    title: "Trois pôles, une signature.",
    body:
      "Nous structurons l'activité autour de trois piliers complémentaires : approvisionnement industriel, formation professionnelle, conseil informatique et digital. Un même client peut nous solliciter sur les trois.",
  },
  {
    year: "Aujourd'hui",
    title: "De l'océan Indien vers plus loin.",
    body:
      "Notre ambition reste simple : rester l'allié concret et accessible des entreprises qui construisent, produisent et forment — à Madagascar d'abord, dans la région océan Indien ensuite.",
  },
];

export default function History() {
  return (
    <>
      <PageHero
        index="→"
        kicker="À propos · Notre histoire"
        title={<>Une jeune entreprise, <span className="italic text-muted-foreground">des racines anciennes.</span></>}
        lede="MA-ERI est née du besoin d'un partenaire qui parle à la fois la langue de l'usine, celle de la salle de formation et celle de la salle serveur."
        meta={[
          { label: "Fondée", value: "2024" },
          { label: "Siège", value: "Toamasina" },
          { label: "Équipe", value: "Locale" },
        ]}
      />

      <section className="container mx-auto px-6 lg:px-10 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <aside className="lg:col-span-4 lg:sticky lg:top-28 h-fit">
            <Kicker accent>Repères</Kicker>
            <h2 className="mt-6 font-display text-display-md font-medium leading-[1.05] text-balance">
              Une trajectoire courte, <span className="italic text-muted-foreground">volontairement construite.</span>
            </h2>
          </aside>

          <ol className="lg:col-span-8 flex flex-col">
            {chapters.map((c, i) => (
              <li
                key={c.year + c.title}
                className="grid grid-cols-12 gap-6 py-10 border-t border-border first:border-t-0"
              >
                <div className="col-span-12 md:col-span-3">
                  <span className="kicker kicker-brand tabular-nums">
                    {String(i + 1).padStart(2, "0")} · {c.year}
                  </span>
                </div>
                <div className="col-span-12 md:col-span-9">
                  <h3 className="font-display text-2xl md:text-3xl font-medium leading-tight">
                    {c.title}
                  </h3>
                  <p className="mt-4 text-muted-foreground leading-relaxed">{c.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container mx-auto px-6 lg:px-10 pb-24 md:pb-32">
        <div className="relative aspect-[21/9] overflow-hidden bg-muted border border-border">
          <Image
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop"
            alt="Port de Toamasina"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <p className="kicker mt-4">Toamasina — porte industrielle de Madagascar.</p>
      </section>

      <CTABlock
        kicker="La suite s'écrit avec vous"
        title={<>Envie d&apos;en faire <span className="italic">un chapitre</span> ?</>}
        description="Devenir client, partenaire ou membre de l'équipe — les trois portes sont ouvertes."
        primary={{ href: "/contact", label: "Nous écrire" }}
        secondary={{ href: "/about/team", label: "Rencontrer l'équipe" }}
      />
    </>
  );
}
