import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Factory, GraduationCap, Code2, Globe2 } from "lucide-react";
import { HomeHero } from "@/components/brand/home-hero";
import {
  CTABlock,
  FeatureGrid,
  Kicker,
  SectionHeading,
  StatBand,
  Steps,
} from "@/components/brand";

const pillars = [
  {
    index: "01",
    title: "Approvisionnement industriel",
    description:
      "Roulements, courroies, joints, tuyaux, vannes, moteurs, pompes. Une chaîne d'approvisionnement fiable pour vos lignes de production.",
    icon: <Factory className="h-5 w-5" />,
    href: "/services/approvisionnement",
  },
  {
    index: "02",
    title: "Matières premières & sourcing",
    description:
      "Import-export, négociation fournisseurs, logistique. Accès à un réseau local et international, de Madagascar à l'Asie et à l'Europe.",
    icon: <Globe2 className="h-5 w-5" />,
    href: "/services/raw-material-supply",
  },
  {
    index: "03",
    title: "Formation professionnelle",
    description:
      "Vente, négociation, management, recouvrement, gestion de stock, accueil client. Programmes pensés pour les PME qui grandissent.",
    icon: <GraduationCap className="h-5 w-5" />,
    href: "/services/professional-training",
  },
  {
    index: "04",
    title: "Conseil informatique & digital",
    description:
      "Data, UI/UX, applications web, microservices. Nous construisons les outils numériques dont vos opérations ont réellement besoin.",
    icon: <Code2 className="h-5 w-5" />,
    href: "/services/conseil-informatique",
  },
];

const manifesto = [
  {
    index: "I.",
    title: "La matière d'abord.",
    description:
      "Rien ne se fabrique sans la bonne pièce au bon moment. Nous traitons l'approvisionnement comme un métier, pas comme une commodité.",
  },
  {
    index: "II.",
    title: "Le savoir, ensuite.",
    description:
      "Une équipe formée produit deux fois mieux. Nos formations sont conçues pour être mises en œuvre dès le lundi suivant.",
  },
  {
    index: "III.",
    title: "Le digital, comme accélérateur.",
    description:
      "Un bon outil disparaît dans l'usage. Nous construisons simple, robuste, maintenable — pas spectaculaire.",
  },
];

const process = [
  {
    title: "Écoute",
    description:
      "Un premier échange sans engagement pour comprendre votre chaîne, vos équipes, vos priorités.",
  },
  {
    title: "Cadrage",
    description:
      "Nous formalisons le besoin, chiffrons, proposons un plan d'action clair et un interlocuteur dédié.",
  },
  {
    title: "Exécution",
    description:
      "Approvisionnement, session de formation ou sprint digital : livraison avec des jalons visibles.",
  },
  {
    title: "Suivi",
    description:
      "Nous restons votre point de contact : réassort, montée en compétence, évolutions techniques.",
  },
];

export default function Home() {
  return (
    <>
      <HomeHero />

      <StatBand
        caption="L'entreprise en chiffres"
        stats={[
          { value: "04", label: "Pôles d'activité" },
          { value: "120", suffix: "+", label: "Références produits" },
          { value: "09", label: "Programmes de formation" },
          { value: "24", suffix: "h", label: "Délai de réponse moyen" },
        ]}
      />

      <section className="container mx-auto px-6 lg:px-10 py-24 md:py-32">
        <div className="max-w-4xl">
          <Kicker index="02" accent>Manifeste</Kicker>
          <h2 className="mt-8 display font-display text-display-lg font-medium leading-[1.02] text-balance">
            Nous croyons qu'une entreprise tient sur
            <span className="italic text-muted-foreground"> trois piliers</span>.
          </h2>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
          {manifesto.map((m) => (
            <article key={m.title} className="flex flex-col gap-5">
              <span
                className="font-display text-3xl font-medium"
                style={{ color: "var(--brand)" }}
              >
                {m.index}
              </span>
              <h3 className="font-display text-2xl md:text-3xl font-medium leading-tight text-pretty">
                {m.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {m.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-border">
        <div className="container mx-auto px-6 lg:px-10 pt-24 md:pt-32">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <SectionHeading
              index="03"
              kicker="Nos pôles"
              title={<>Quatre métiers, <span className="italic text-muted-foreground">une seule adresse.</span></>}
              lede="Un interlocuteur unique pour vos besoins industriels, pédagogiques et numériques — pensé pour les PME qui veulent avancer sans multiplier les prestataires."
            />
            <Link
              href="/services"
              className="group inline-flex items-center gap-3 rounded-full border border-border px-6 py-3 text-sm font-medium hover:border-foreground/60 transition-colors shrink-0"
            >
              Tous nos services
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </div>

          <div className="mt-16">
            <FeatureGrid
              columns={2}
              features={pillars.map((p) => ({
                index: p.index,
                title: p.title,
                description: p.description,
                icon: p.icon,
              }))}
            />
          </div>

          <ul className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-px bg-border border border-border">
            {pillars.map((p) => (
              <li key={p.href} className="bg-background">
                <Link
                  href={p.href}
                  className="group flex items-center justify-between px-8 py-5 text-sm hover:bg-secondary/50 transition-colors"
                >
                  <span className="text-muted-foreground">→ {p.title}</span>
                  <span className="inline-flex items-center gap-2 font-medium">
                    Explorer
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-24 md:mt-32">
        <div className="container mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-7 relative aspect-[4/5] md:aspect-[4/3] overflow-hidden bg-muted">
            <Image
              src="https://images.unsplash.com/photo-1565043666747-69f6646db940?q=80&w=2070&auto=format&fit=crop"
              alt="Atelier industriel — pièces mécaniques"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 58vw, 100vw"
            />
          </div>
          <div className="lg:col-span-5 flex flex-col gap-6">
            <Kicker index="—" accent>Terrain</Kicker>
            <h3 className="font-display text-display-md font-medium leading-[1.05] text-balance">
              Une entreprise malgache ancrée dans la réalité de ses clients.
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Nous parlons la langue de l'usine et celle du bureau. Nos équipes
              se déplacent sur vos sites, comprennent vos contraintes
              logistiques, et proposent des solutions qui tiennent dans votre
              budget comme dans votre planning.
            </p>
            <Link
              href="/about/mission"
              className="group inline-flex items-center gap-3 text-sm font-medium brand-underline self-start"
            >
              Notre approche
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-24 md:mt-32 border-t border-border">
        <div className="container mx-auto px-6 lg:px-10 py-24 md:py-32">
          <SectionHeading
            index="04"
            kicker="Méthode"
            title={<>Comment nous travaillons <span className="italic text-muted-foreground">ensemble.</span></>}
            lede="Un processus volontairement simple, conçu pour vous faire perdre le moins de temps possible."
          />
          <div className="mt-16">
            <Steps steps={process} />
          </div>
        </div>
      </section>

      <CTABlock
        kicker="05 — Parlons de votre projet"
        title={<>Prêts à passer <span className="italic">à l&apos;action</span> ?</>}
        description="Décrivez-nous votre besoin en quelques lignes. Un chargé de clientèle vous répond sous 24 heures ouvrées."
        primary={{ href: "/contact", label: "Demander un devis" }}
        secondary={{ href: "/pricing/medium-business", label: "Voir nos formules" }}
      />
    </>
  );
}
