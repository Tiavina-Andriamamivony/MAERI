import { Checklist, CTABlock, FeatureGrid, PageHero, SectionHeading, StatBand } from "@/components/brand";
import { Ship, Package, ClipboardCheck, Globe2 } from "lucide-react";

export const metadata = {
  title: "Matières premières",
  description:
    "Sourcing et approvisionnement en matières premières pour l'industrie malgache — local, régional, international.",
};

const pillars = [
  {
    index: "01",
    title: "Sourcing multi-zones",
    description:
      "Madagascar d'abord, puis Afrique de l'Est, Asie du Sud-Est, Europe. Le bon compromis prix / délai / qualité pour chaque référence.",
    icon: <Globe2 className="h-5 w-5" />,
  },
  {
    index: "02",
    title: "Contrôle qualité",
    description:
      "Vérification documentaire, échantillonnage, contrôle pré-embarquement sur les flux critiques.",
    icon: <ClipboardCheck className="h-5 w-5" />,
  },
  {
    index: "03",
    title: "Logistique intégrée",
    description:
      "Import-export, dédouanement, transport jusqu'à vos quais. Une seule facture, un seul interlocuteur.",
    icon: <Ship className="h-5 w-5" />,
  },
  {
    index: "04",
    title: "Conditionnement sur mesure",
    description:
      "Reconditionnement, allotissement, étiquetage. Vous recevez la matière prête à entrer en production.",
    icon: <Package className="h-5 w-5" />,
  },
];

const guarantees = [
  "Proposition comparative avec au minimum 2 sources par référence critique.",
  "Visibilité sur le coût complet (matière + logistique + taxes) dès le devis.",
  "Traçabilité documentaire sur toute la chaîne d'import.",
  "Contrats d'approvisionnement pluriannuels disponibles dès 12 mois de relation.",
];

export default function RawMaterialSupply() {
  return (
    <>
      <PageHero
        index="→"
        kicker="Services · Matières premières"
        title={<>La matière, <span className="italic text-muted-foreground">au bon endroit,</span> au bon moment.</>}
        lede="Un approvisionnement stratégique ne se résume pas à acheter au meilleur prix. Nous cherchons la combinaison prix, délai, qualité et robustesse qui convient à votre production."
        meta={[
          { label: "Zones de sourcing", value: "MG · AS · EU" },
          { label: "Incoterms", value: "EXW — DDP" },
          { label: "Audit fournisseur", value: "Inclus" },
        ]}
      />

      <section className="container mx-auto px-6 lg:px-10 py-24 md:py-32">
        <SectionHeading
          index="02"
          kicker="Notre offre"
          title={<>Quatre briques <span className="italic text-muted-foreground">intégrées.</span></>}
          lede="Vous pouvez nous déléguer la chaîne complète, ou seulement le maillon que vous ne maîtrisez pas encore."
        />
        <div className="mt-16">
          <FeatureGrid columns={4} features={pillars} />
        </div>
      </section>

      <StatBand
        caption="Nos flux"
        stats={[
          { value: "08", label: "Pays sources" },
          { value: "45", suffix: "j", label: "Délai moyen Asie → Toamasina" },
          { value: "100", suffix: "%", label: "Commandes traçables" },
          { value: "02", label: "Sources par référence critique" },
        ]}
      />

      <section className="container mx-auto px-6 lg:px-10 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <SectionHeading
              index="03"
              kicker="Nos garanties"
              title={<>Quatre règles <span className="italic text-muted-foreground">que nous tenons.</span></>}
            />
          </div>
          <div className="lg:col-span-7">
            <Checklist items={guarantees} />
          </div>
        </div>
      </section>

      <CTABlock
        kicker="Un flux à sécuriser ?"
        title={<>Envoyez-nous <span className="italic">votre liste d&apos;achats.</span></>}
        description="Nous revenons avec deux à trois propositions chiffrées, incoterms clairs et délais confirmés."
        primary={{ href: "/contact", label: "Envoyer ma liste" }}
        secondary={{ href: "/services/supplier-networking", label: "Voir le réseau fournisseurs" }}
      />
    </>
  );
}
