import { Checklist, CTABlock, Kicker, PageHero, SectionHeading } from "@/components/brand";

export const metadata = {
  title: "Notre mission",
  description:
    "La mission de MA-ERI Consulting : fournir la matière, le savoir et le digital aux PME qui produisent.",
};

const principles = [
  {
    index: "I",
    title: "Servir la production, pas la distraire.",
    body: "Nous livrons ce qui est utile, au moment où c'est utile. Aucune recommandation qui n'ait pas de traduction opérationnelle.",
  },
  {
    index: "II",
    title: "Parler clair, facturer clair.",
    body: "Pas de jargon, pas de forfait opaque. Nos devis sont lisibles par un chef d'atelier comme par un directeur financier.",
  },
  {
    index: "III",
    title: "Rester joignables.",
    body: "Un seul interlocuteur par compte, un téléphone qui décroche. La relation humaine n'est pas un canal parmi d'autres.",
  },
  {
    index: "IV",
    title: "Transmettre à chaque intervention.",
    body: "Chaque mission laisse derrière elle une équipe un peu plus autonome. La dépendance au prestataire n'est pas un modèle d'affaires sain.",
  },
];

const commitments = [
  "Répondre à toute demande entrante sous 24 heures ouvrées.",
  "Privilégier le sourcing local malgache chaque fois qu'il est compétitif.",
  "Refuser une mission que nous ne savons pas exécuter proprement.",
  "Documenter ce que nous livrons, pour que d'autres puissent le reprendre.",
  "Former au moins une personne par mission chez le client.",
];

export default function Mission() {
  return (
    <>
      <PageHero
        index="→"
        kicker="À propos · Notre mission"
        title={<>Rendre les PME <span className="italic text-muted-foreground">plus autonomes.</span></>}
        lede="Notre rôle n'est pas de vous rendre dépendant. C'est de vous laisser, après chaque intervention, mieux équipé, mieux formé, mieux outillé."
      />

      <section className="container mx-auto px-6 lg:px-10 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <Kicker accent>Notre promesse</Kicker>
            <p className="mt-8 font-display text-display-md font-medium leading-[1.08] text-balance">
              Matière, savoir, digital. Les trois leviers qui <span className="italic text-muted-foreground">font tenir</span> une entreprise.
            </p>
          </div>
          <div className="lg:col-span-7">
            <p className="text-lg text-muted-foreground leading-relaxed">
              MA-ERI Consulting existe pour combler un vide concret : celui d&apos;un partenaire unique, capable d&apos;intervenir aussi bien sur vos approvisionnements que sur la montée en compétence de vos équipes ou la mise en place d&apos;outils numériques. Trois métiers qui, dans la réalité d&apos;une PME, ne sont jamais indépendants.
            </p>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Nous refusons la posture du cabinet qui vend du conseil sans exécuter. Nous livrons des pièces, nous animons des formations, nous écrivons du code. Le tout, à partir d&apos;un seul contrat et d&apos;un seul contact.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="container mx-auto px-6 lg:px-10 py-24 md:py-32">
          <SectionHeading
            index="02"
            kicker="Nos principes"
            title={<>Quatre règles <span className="italic text-muted-foreground">non-négociables.</span></>}
          />

          <ol className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border">
            {principles.map((p) => (
              <li key={p.index} className="bg-background p-10 flex flex-col gap-4">
                <span
                  className="font-display text-5xl font-medium"
                  style={{ color: "var(--brand)" }}
                >
                  {p.index}
                </span>
                <h3 className="font-display text-2xl md:text-3xl font-medium leading-tight">
                  {p.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container mx-auto px-6 lg:px-10 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <SectionHeading
              index="03"
              kicker="Engagements"
              title={<>Cinq choses auxquelles <span className="italic text-muted-foreground">vous pouvez nous tenir.</span></>}
            />
          </div>
          <div className="lg:col-span-7">
            <Checklist items={commitments} />
          </div>
        </div>
      </section>

      <CTABlock
        kicker="Mettons-nous au travail"
        title={<>Votre mission, <span className="italic">notre prochaine ligne.</span></>}
        primary={{ href: "/contact", label: "Démarrer un projet" }}
        secondary={{ href: "/services", label: "Voir nos services" }}
      />
    </>
  );
}
