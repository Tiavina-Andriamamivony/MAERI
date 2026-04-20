import { CTABlock, FeatureGrid, PageHero, SectionHeading, Steps } from "@/components/brand";
import Link from "next/link";
import { ArrowUpRight, GraduationCap, ShieldCheck, Target } from "lucide-react";

export const metadata = {
  title: "Formation professionnelle",
  description:
    "Programmes courts, opérationnels et adaptés au contexte malgache : vente, management, stock, recouvrement, accueil client.",
};

const pillars = [
  {
    index: "01",
    title: "Programmes pragmatiques",
    description:
      "Nos modules sont conçus pour être rejoués sur le terrain dès le lendemain — pas pour décorer un CV.",
    icon: <Target className="h-5 w-5" />,
  },
  {
    index: "02",
    title: "Intervenants praticiens",
    description:
      "Nos formateurs viennent de l'industrie, de la distribution ou du commerce. Ils ont fait avant d'enseigner.",
    icon: <GraduationCap className="h-5 w-5" />,
  },
  {
    index: "03",
    title: "Évaluation honnête",
    description:
      "Nous mesurons ce qui a changé à 30 et 90 jours — en vérifiant auprès de votre hiérarchie, pas que du participant.",
    icon: <ShieldCheck className="h-5 w-5" />,
  },
];

const steps = [
  { title: "Écoute", description: "Un échange pour comprendre votre objectif : commercial, managérial, technique." },
  { title: "Programme", description: "Nous construisons un parcours sur mesure parmi nos modules éprouvés." },
  { title: "Session", description: "Formation en présentiel, en intra ou inter-entreprises, en français ou en malgache." },
  { title: "Ancrage", description: "Suivi individuel, évaluation à froid, transmission à votre direction." },
];

const levels = [
  { href: "/training/basic", label: "Formation de base", hint: "Fondamentaux opérationnels · 2 jours" },
  { href: "/training/advanced", label: "Formation avancée", hint: "Encadrement & management · 3 jours + coaching" },
  { href: "/training/specialized", label: "Formation spécialisée", hint: "Parcours métiers sur mesure · 3–10 jours" },
];

export default function ProfessionalTraining() {
  return (
    <>
      <PageHero
        index="→"
        kicker="Services · Formation professionnelle"
        title={<>Former, <span className="italic text-muted-foreground">pour que ça tienne.</span></>}
        lede="Des programmes courts et directement applicables — conçus pour que vos équipes repartent avec un geste nouveau, pas un diplôme supplémentaire."
        meta={[
          { label: "Niveaux", value: "03" },
          { label: "Langues", value: "FR · MG" },
          { label: "Format", value: "Intra / Inter" },
          { label: "Suivi", value: "30 & 90 j" },
        ]}
      />

      <section className="container mx-auto px-6 lg:px-10 py-24 md:py-32">
        <SectionHeading
          index="02"
          kicker="Notre approche"
          title={<>Trois convictions, <span className="italic text-muted-foreground">trois conséquences.</span></>}
        />
        <div className="mt-16">
          <FeatureGrid columns={3} features={pillars} />
        </div>
      </section>

      <section className="border-t border-border">
        <div className="container mx-auto px-6 lg:px-10 py-24 md:py-32">
          <SectionHeading
            index="03"
            kicker="Les trois niveaux"
            title={<>Choisissez <span className="italic text-muted-foreground">votre point d&apos;entrée.</span></>}
            lede="Nos formations s'articulent en trois paliers. Vous pouvez commencer par l'un, continuer par l'autre, ou combiner les trois."
          />
          <ul className="mt-16 border-t border-border">
            {levels.map((l) => (
              <li key={l.href} className="border-b border-border">
                <Link
                  href={l.href}
                  className="group flex flex-col md:flex-row md:items-end md:justify-between gap-4 py-10 hover:bg-secondary/50 px-4 -mx-4 transition-colors"
                >
                  <div className="flex flex-col gap-2">
                    <span className="kicker kicker-brand">{l.hint}</span>
                    <span className="font-display text-3xl md:text-4xl font-medium leading-tight">
                      {l.label}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-2 text-sm font-medium">
                    Découvrir
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container mx-auto px-6 lg:px-10 py-24 md:py-32">
        <SectionHeading
          index="04"
          kicker="Méthode"
          title={<>Quatre étapes, <span className="italic text-muted-foreground">pas une de plus.</span></>}
        />
        <div className="mt-16">
          <Steps steps={steps} />
        </div>
      </section>

      <CTABlock
        kicker="Un plan de formation à construire ?"
        title={<>Un seul échange suffit <span className="italic">pour démarrer.</span></>}
        primary={{ href: "/contact", label: "Planifier un cadrage" }}
        secondary={{ href: "/services", label: "Tous nos services" }}
      />
    </>
  );
}
