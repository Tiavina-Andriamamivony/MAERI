import { CTABlock, FeatureGrid, PageHero, SectionHeading } from "@/components/brand";
import { Zap, Cog, Wrench, Fan } from "lucide-react";

export const metadata = {
  title: "Équipements spécialisés",
  description:
    "Moteurs électriques, pompes hydrauliques, roulements, courroies : pièces critiques pour vos lignes de production.",
};

const families = [
  {
    index: "01",
    title: "Moteurs électriques",
    description:
      "Moteurs triphasés IE2 / IE3, puissances de 0,37 à 250 kW. Stock de références standards, approvisionnement rapide sur spéciaux.",
    icon: <Zap className="h-5 w-5" />,
  },
  {
    index: "02",
    title: "Pompes hydrauliques",
    description:
      "Centrifuges, volumétriques, doseuses. Pour eau claire, eaux chargées, produits visqueux ou chimiques.",
    icon: <Cog className="h-5 w-5" />,
  },
  {
    index: "03",
    title: "Transmission mécanique",
    description:
      "Roulements, paliers, courroies trapézoïdales et plates, chaînes, accouplements. Toutes marques référencées.",
    icon: <Wrench className="h-5 w-5" />,
  },
  {
    index: "04",
    title: "Ventilation & process",
    description:
      "Ventilateurs industriels, extracteurs, filtres à air, gaines. Dimensionnement selon votre débit cible.",
    icon: <Fan className="h-5 w-5" />,
  },
];

export default function SpecializedEquipment() {
  return (
    <>
      <PageHero
        index="→"
        kicker="Produits · Équipements"
        title={<>Les pièces qui, <span className="italic text-muted-foreground">quand elles tombent,</span> arrêtent l&apos;usine.</>}
        lede="Nous traitons les équipements critiques avec le soin qu'ils méritent. Conseil technique, sourcing équivalent, suivi du cycle de vie."
      />

      <section className="container mx-auto px-6 lg:px-10 py-24 md:py-32">
        <SectionHeading
          index="02"
          kicker="Familles"
          title={<>Quatre domaines, <span className="italic text-muted-foreground">un seul point de contact.</span></>}
        />
        <div className="mt-16">
          <FeatureGrid columns={4} features={families} />
        </div>
      </section>

      <section className="container mx-auto px-6 lg:px-10 pb-24 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 border-t border-border pt-16">
          <div>
            <h3 className="font-display text-display-md font-medium leading-[1.05] text-balance">
              Équivalence technique, <span className="italic text-muted-foreground">pas copie à l&apos;aveugle.</span>
            </h3>
          </div>
          <div className="flex flex-col gap-4 text-muted-foreground leading-relaxed">
            <p>
              Quand une pièce d&apos;origine n&apos;est plus disponible, nous proposons un équivalent uniquement si sa fiche technique est strictement compatible avec votre installation. Pas de substitution à l&apos;aveugle.
            </p>
            <p>
              Pour les pièces les plus critiques, nous conservons en stock avancé chez notre partenaire logistique une petite réserve de sécurité négociée avec vous.
            </p>
          </div>
        </div>
      </section>

      <CTABlock
        kicker="Panne imminente ?"
        title={<>Décrivez la pièce, <span className="italic">nous la trouvons.</span></>}
        description="Plaque signalétique, photo, référence constructeur — tout ce que vous avez suffit pour démarrer la recherche."
        primary={{ href: "/contact", label: "Contacter un technicien" }}
      />
    </>
  );
}
