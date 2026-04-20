import Link from "next/link";
import { ArrowUpRight, Factory, Globe2, GraduationCap, Code2, Users2 } from "lucide-react";
import {
  CTABlock,
  FeatureGrid,
  PageHero,
  SectionHeading,
} from "@/components/brand";

export const metadata = {
  title: "Services",
  description:
    "Approvisionnement industriel, matières premières, formation professionnelle, conseil informatique — l'offre complète MA-ERI Consulting.",
};

const services = [
  {
    index: "01",
    title: "Approvisionnement industriel",
    description:
      "Une gamme complète de pièces et composants : roulements, courroies, joints, tuyaux, vannes, moteurs électriques et pompes hydrauliques.",
    icon: <Factory className="h-5 w-5" />,
    href: "/services/approvisionnement",
  },
  {
    index: "02",
    title: "Matières premières",
    description:
      "Sourcing local et international, négociation, logistique et contrôle qualité pour alimenter vos lignes de production.",
    icon: <Globe2 className="h-5 w-5" />,
    href: "/services/raw-material-supply",
  },
  {
    index: "03",
    title: "Réseau de fournisseurs",
    description:
      "Accès à notre carnet d'adresses industriel. Mise en relation ciblée et négociation assistée pour vos achats critiques.",
    icon: <Users2 className="h-5 w-5" />,
    href: "/services/supplier-networking",
  },
  {
    index: "04",
    title: "Formation professionnelle",
    description:
      "Programmes courts et opérationnels pour vos équipes : vente, management, gestion de stock, recouvrement, accueil client.",
    icon: <GraduationCap className="h-5 w-5" />,
    href: "/services/professional-training",
  },
  {
    index: "05",
    title: "Conseil informatique",
    description:
      "Data, UI/UX, applications web, microservices, transformation digitale. Des outils sur mesure pour vos opérations.",
    icon: <Code2 className="h-5 w-5" />,
    href: "/services/conseil-informatique",
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        index="01"
        kicker="Nos services"
        title={<>L&apos;industrie, la pédagogie et le digital — <span className="italic text-muted-foreground">en un seul guichet.</span></>}
        lede="Cinq métiers complémentaires que nous exerçons avec la même exigence. Chacun peut être actionné seul ou combiné aux autres selon votre besoin."
        meta={[
          { label: "Pôles", value: "05" },
          { label: "Références", value: "120+" },
          { label: "Délai de réponse", value: "24h" },
          { label: "Zone", value: "Océan Indien" },
        ]}
      />

      <section className="container mx-auto px-6 lg:px-10 py-24 md:py-32">
        <SectionHeading
          index="02"
          kicker="Catalogue"
          title={<>Cinq portes d&apos;entrée, <span className="italic text-muted-foreground">un seul partenaire.</span></>}
          lede="Chaque pôle est porté par une équipe dédiée. Vous gardez le même interlocuteur, même si votre besoin évolue."
        />

        <div className="mt-16">
          <FeatureGrid columns={3} features={services} />
        </div>

        <ul className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-px bg-border border border-border">
          {services.map((s) => (
            <li key={s.href} className="bg-background">
              <Link
                href={s.href}
                className="group flex items-center justify-between px-8 py-5 text-sm hover:bg-secondary/50 transition-colors"
              >
                <span className="text-muted-foreground">
                  {s.index} — {s.title}
                </span>
                <span className="inline-flex items-center gap-2 font-medium">
                  Explorer
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <CTABlock
        kicker="Besoin d'un devis ?"
        title={<>Un projet précis ? <span className="italic">Écrivez-nous.</span></>}
        description="Un chargé de clientèle vous répond sous 24 heures ouvrées avec une première proposition."
        primary={{ href: "/contact", label: "Demander un devis" }}
        secondary={{ href: "/about/mission", label: "Notre mission" }}
      />
    </>
  );
}
