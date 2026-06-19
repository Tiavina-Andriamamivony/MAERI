import { CTABlock, FeatureGrid, PageHero, SectionHeading, Steps } from "@/components/brand";
import { BarChart, Palette, Code, Lightbulb } from "lucide-react";

export const metadata = {
  title: "Conseil informatique & digital",
  description:
    "Data, UI/UX, applications web, microservices et transformation digitale pour les PME industrielles et de services.",
};

const offers = [
  {
    index: "01",
    title: "Analyse de données",
    description:
      "Tableaux de bord opérationnels, audits data, mise en place d'indicateurs utiles. Excel, Power BI, ou outil sur mesure.",
    icon: <BarChart className="h-5 w-5" />,
  },
  {
    index: "02",
    title: "Design UI / UX",
    description:
      "Interfaces web et mobiles qui respectent votre marque et qui se comprennent en trois secondes.",
    icon: <Palette className="h-5 w-5" />,
  },
  {
    index: "03",
    title: "Applications & microservices",
    description:
      "Développement web moderne (Next.js, Node, Python) et architectures microservices quand c'est pertinent — pas par défaut.",
    icon: <Code className="h-5 w-5" />,
  },
  {
    index: "04",
    title: "Transformation digitale",
    description:
      "Cadrage, choix d'outils, conduite du changement. Nous refusons les projets trop gros pour réussir.",
    icon: <Lightbulb className="h-5 w-5" />,
  },
];

const steps = [
  { title: "Discovery", description: "Un ou deux ateliers pour comprendre votre flux, vos contraintes, vos utilisateurs." },
  { title: "Cadrage", description: "Une proposition chiffrée, découpée en jalons livrables indépendamment." },
  { title: "Livraison", description: "Sprints courts, démos régulières, mise en production progressive." },
  { title: "Transmission", description: "Documentation, code lisible, formation de votre équipe. Pas de dépendance imposée." },
];

export default function ConseilInformatique() {
  return (
    <>
      <PageHero
        index="→"
        kicker="Services · Conseil IT & digital"
        title={<>Le digital, <span className="italic text-muted-foreground">comme un outil,</span> pas comme une fin.</>}
        lede="Nous construisons des logiciels qui font gagner du temps, pas des démonstrations techniques. Simples, robustes, maintenables."
        meta={[
          { label: "Stack", value: "Next · Node · Python" },
          { label: "Méthode", value: "Sprints courts" },
          { label: "Livraison", value: "4 à 12 semaines" },
        ]}
      />

      <section className="container mx-auto px-6 lg:px-10 py-24 md:py-32">
        <SectionHeading
          index="02"
          kicker="Domaines"
          title={<>Quatre pratiques, <span className="italic text-muted-foreground">une même philosophie.</span></>}
          lede="Nous choisissons l'outil le plus simple qui résout le problème. Pas celui qui impressionne le plus."
        />
        <div className="mt-16">
          <FeatureGrid columns={4} features={offers} />
        </div>
      </section>

      <section className="border-t border-border">
        <div className="container mx-auto px-6 lg:px-10 py-24 md:py-32">
          <SectionHeading
            index="03"
            kicker="Méthode"
            title={<>Quatre étapes, <span className="italic text-muted-foreground">des jalons lisibles.</span></>}
            lede="Chaque jalon a un livrable concret. À aucun moment vous ne payez pour du travail invisible."
          />
          <div className="mt-16">
            <Steps steps={steps} />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 lg:px-10 pb-24 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 border-t border-border pt-16">
          <div>
            <h3 className="font-display text-display-md font-medium leading-[1.05] text-balance">
              Un bon logiciel <span className="italic text-muted-foreground">disparaît dans l&apos;usage.</span>
            </h3>
          </div>
          <div className="flex flex-col gap-4 text-muted-foreground leading-relaxed">
            <p>
              Nous livrons des outils qui se remarquent par leur absence de frictions, pas par leur nombre de fonctionnalités. Un bouton de plus n&apos;a jamais sauvé un projet.
            </p>
            <p>
              Notre code est lisible, documenté, testable. Votre équipe doit pouvoir le reprendre, l&apos;amender et l&apos;étendre sans nous rappeler.
            </p>
          </div>
        </div>
      </section>

      <CTABlock
        kicker="Un logiciel à construire ?"
        title={<>Parlons du problème, <span className="italic">pas de la solution.</span></>}
        description="Un premier échange de 30 minutes suffit pour savoir si le projet mérite d'être lancé — ou non."
        primary={{ href: "/contact", label: "Cadrer un projet" }}
        secondary={{ href: "/about/mission", label: "Notre approche" }}
      />
    </>
  );
}
