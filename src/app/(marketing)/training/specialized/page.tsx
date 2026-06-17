import { Checklist, CTABlock, FeatureGrid, PageHero, SectionHeading } from "@/components/brand";
import { Wrench, Database, Truck, LineChart } from "lucide-react";

export const metadata = {
  title: "Formation spécialisée",
  description:
    "Parcours métiers sur mesure : maintenance industrielle, logistique, data, contrôle qualité.",
};

const tracks = [
  {
    index: "01",
    title: "Maintenance industrielle",
    description:
      "Diagnostic, lubrification, alignement, préventif structuré. Pour techniciens d'atelier et responsables maintenance.",
    icon: <Wrench className="h-5 w-5" />,
  },
  {
    index: "02",
    title: "Logistique & supply chain",
    description:
      "Prévision, réassort, import-export, documentation douanière. Pour responsables logistique et acheteurs.",
    icon: <Truck className="h-5 w-5" />,
  },
  {
    index: "03",
    title: "Data pour non-data",
    description:
      "Excel avancé, Power BI, tableaux de bord. Pour contrôleurs de gestion et chefs de projet terrain.",
    icon: <Database className="h-5 w-5" />,
  },
  {
    index: "04",
    title: "Pilotage commercial",
    description:
      "Construire un plan de compte, suivre un pipeline, challenger un portefeuille. Pour directions commerciales.",
    icon: <LineChart className="h-5 w-5" />,
  },
];

const guarantees = [
  "Programme co-construit avec votre direction métier.",
  "Intervenants praticiens, pas académiques.",
  "Supports et exercices issus de votre propre entreprise.",
  "Évaluation à froid à 60 jours, transmise à la direction.",
];

export default function SpecializedTraining() {
  return (
    <>
      <PageHero
        index="III"
        kicker="Formation · Niveau 3"
        title={<>Des parcours métiers, <span className="italic text-muted-foreground">pas des catalogues.</span></>}
        lede="Quand les formations standards ne suffisent pas, nous construisons un parcours sur mesure pour vos équipes spécialisées."
        meta={[
          { label: "Format", value: "Sur mesure" },
          { label: "Durée", value: "3 à 10 jours" },
          { label: "Cadrage", value: "Co-construit" },
        ]}
      />

      <section className="container mx-auto px-6 lg:px-10 py-24 md:py-32">
        <SectionHeading
          index="02"
          kicker="Domaines d'intervention"
          title={<>Quatre spécialités <span className="italic text-muted-foreground">au choix.</span></>}
          lede="Chaque parcours est adapté à votre contexte. Les thématiques ci-dessous donnent le ton, pas la limite."
        />
        <div className="mt-16">
          <FeatureGrid columns={4} features={tracks} />
        </div>
      </section>

      <section className="border-t border-border">
        <div className="container mx-auto px-6 lg:px-10 py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5">
              <SectionHeading
                index="03"
                kicker="Nos garanties"
                title={<>Quatre engagements <span className="italic text-muted-foreground">fermes.</span></>}
              />
            </div>
            <div className="lg:col-span-7">
              <Checklist items={guarantees} />
            </div>
          </div>
        </div>
      </section>

      <CTABlock
        kicker="Parlons de vos experts"
        title={<>Une compétence rare <span className="italic">à renforcer ?</span></>}
        description="Décrivez-nous le besoin, nous construisons le parcours autour de vos équipes, pas l'inverse."
        primary={{ href: "/contact", label: "Cadrer un parcours" }}
        secondary={{ href: "/training/basic", label: "Voir la formation de base" }}
      />
    </>
  );
}
