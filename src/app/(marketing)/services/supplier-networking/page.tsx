import { CTABlock, FeatureGrid, PageHero, SectionHeading, Steps } from "@/components/brand";
import { Handshake, Search, Shield, MessageCircle } from "lucide-react";

export const metadata = {
  title: "Réseau de fournisseurs",
  description:
    "Mise en relation avec des fournisseurs qualifiés et négociation assistée, à Madagascar et à l'international.",
};

const value = [
  {
    index: "01",
    title: "Recherche ciblée",
    description:
      "Nous identifions des fournisseurs qui correspondent à votre cahier des charges réel — pas ceux qui ont le meilleur site web.",
    icon: <Search className="h-5 w-5" />,
  },
  {
    index: "02",
    title: "Présélection qualifiée",
    description:
      "Audit documentaire, vérification de références, échantillonnage. Vous ne rencontrez que des interlocuteurs sérieux.",
    icon: <Shield className="h-5 w-5" />,
  },
  {
    index: "03",
    title: "Négociation accompagnée",
    description:
      "Nous participons aux premiers échanges, vous aidons à cadrer le contrat, puis vous laissons la relation.",
    icon: <Handshake className="h-5 w-5" />,
  },
  {
    index: "04",
    title: "Médiation continue",
    description:
      "Si un différend survient après mise en relation, nous restons disponibles pour faciliter la résolution.",
    icon: <MessageCircle className="h-5 w-5" />,
  },
];

const steps = [
  { title: "Brief", description: "Un cahier des charges en 5 points : matière, volume, géographie, budget, délai." },
  { title: "Shortlist", description: "Sous 10 jours, une liste de 3 à 5 fournisseurs qualifiés avec fiche de synthèse." },
  { title: "Rencontres", description: "Nous organisons les échanges et sommes présents lors des premiers rendez-vous." },
  { title: "Transfert", description: "Une fois le fournisseur choisi, la relation commerciale vous appartient totalement." },
];

export default function SupplierNetworking() {
  return (
    <>
      <PageHero
        index="→"
        kicker="Services · Réseau fournisseurs"
        title={<>Les bonnes portes, <span className="italic text-muted-foreground">ouvertes à l&apos;avance.</span></>}
        lede="Plutôt que de vendre un annuaire, nous mobilisons notre réseau pour vous mettre en relation avec les fournisseurs qui correspondent à votre besoin exact."
        meta={[
          { label: "Shortlist", value: "10 jours" },
          { label: "Sources", value: "Vérifiées" },
          { label: "Transfert", value: "Sans frais" },
        ]}
      />

      <section className="container mx-auto px-6 lg:px-10 py-24 md:py-32">
        <SectionHeading
          index="02"
          kicker="Notre valeur ajoutée"
          title={<>Quatre gestes <span className="italic text-muted-foreground">que nous faisons pour vous.</span></>}
        />
        <div className="mt-16">
          <FeatureGrid columns={4} features={value} />
        </div>
      </section>

      <section className="border-t border-border">
        <div className="container mx-auto px-6 lg:px-10 py-24 md:py-32">
          <SectionHeading
            index="03"
            kicker="Process"
            title={<>Dix jours <span className="italic text-muted-foreground">pour shortlister.</span></>}
            lede="Un rythme volontairement court. Plus la recherche traîne, moins elle rend service."
          />
          <div className="mt-16">
            <Steps steps={steps} />
          </div>
        </div>
      </section>

      <CTABlock
        kicker="Un besoin de sourcing ?"
        title={<>Dites-nous <span className="italic">ce que vous cherchez.</span></>}
        primary={{ href: "/contact", label: "Briefer notre équipe" }}
        secondary={{ href: "/services/raw-material-supply", label: "Voir l'offre matières premières" }}
      />
    </>
  );
}
