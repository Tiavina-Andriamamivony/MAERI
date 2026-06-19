import { CTABlock, FeatureGrid, PageHero, SectionHeading, StatBand } from "@/components/brand";
import { Droplets, Flame, GitBranch, Gauge } from "lucide-react";

export const metadata = {
  title: "Tuyaux industriels",
  description:
    "Tuyaux acier, PVC, PEHD, inox et accessoires de raccordement pour fluides, gaz et process industriels.",
};

const families = [
  {
    index: "01",
    title: "Eau & assainissement",
    description:
      "PVC pression, PEHD soudable, fontes assainissement. Diamètres DN40 à DN600, avec raccords et vannes.",
    icon: <Droplets className="h-5 w-5" />,
  },
  {
    index: "02",
    title: "Fluides industriels",
    description:
      "Tuyaux acier noir, inox 304 / 316L, flexibles haute pression. Pour vapeur, huile, produits chimiques.",
    icon: <Flame className="h-5 w-5" />,
  },
  {
    index: "03",
    title: "Raccords & accessoires",
    description:
      "Brides, coudes, tés, réducteurs, manchettes. Compatibilité normative vérifiée au sourcing.",
    icon: <GitBranch className="h-5 w-5" />,
  },
  {
    index: "04",
    title: "Vannes & régulation",
    description:
      "Vannes papillon, à boisseau, de régulation, clapets anti-retour. Commande manuelle ou motorisée.",
    icon: <Gauge className="h-5 w-5" />,
  },
];

export default function IndustrialPipes() {
  return (
    <>
      <PageHero
        index="→"
        kicker="Produits · Tuyauterie"
        title={<>Conduire les fluides, <span className="italic text-muted-foreground">sans compromis.</span></>}
        lede="Tuyaux, raccords et vannes pour vos réseaux d'eau, d'air, de vapeur et de produits chimiques. Catalogue complet, conseil sur spécifications."
        meta={[
          { label: "Familles", value: "04" },
          { label: "Matières", value: "PVC · PEHD · Acier · Inox" },
          { label: "Diamètres", value: "DN15 — DN600" },
        ]}
      />

      <section className="container mx-auto px-6 lg:px-10 py-24 md:py-32">
        <SectionHeading
          index="02"
          kicker="Gamme"
          title={<>Quatre familles, <span className="italic text-muted-foreground">tous vos fluides.</span></>}
          lede="Nous choisissons la bonne matière et la bonne norme pour chaque usage — eau potable, circuit vapeur, fluide corrosif, gaz."
        />
        <div className="mt-16">
          <FeatureGrid columns={4} features={families} />
        </div>
      </section>

      <StatBand
        caption="Pourquoi nous"
        stats={[
          { value: "300", suffix: "+", label: "Références en stock partenaire" },
          { value: "98", suffix: "%", label: "Commandes livrées complètes" },
          { value: "10", suffix: "bars", label: "Pression standard eau" },
          { value: "316", suffix: "L", label: "Inox alimentaire & chimique" },
        ]}
      />

      <CTABlock
        kicker="Plan de réseau ?"
        title={<>Envoyez votre <span className="italic">isométrique.</span></>}
        description="Nous retournons un chiffrage ligne par ligne avec alternatives techniques si besoin."
        primary={{ href: "/contact", label: "Chiffrer mon réseau" }}
        secondary={{ href: "/products/specialized-equipment", label: "Voir les équipements" }}
      />
    </>
  );
}
