import { Checklist, CTABlock, PageHero, SectionHeading, Steps } from "@/components/brand";

export const metadata = {
  title: "Formation avancée",
  description:
    "Management, négociation, pilotage opérationnel : la formation des encadrants et des chefs d'équipe.",
};

const modules = [
  "Management d'équipe en contexte malgache",
  "Négociation commerciale (cycle B2B)",
  "Pilotage par indicateurs : construire son tableau de bord",
  "Résolution de conflits et communication difficile",
  "Conduite du changement dans une PME",
  "Recouvrement structuré : du relance à la procédure",
];

const steps = [
  { title: "Cadrage direction", description: "Entretien avec la direction pour aligner objectifs et indicateurs de succès." },
  { title: "Formation", description: "Trois jours, en deux temps : séminaire + journée d'application à 3 semaines." },
  { title: "Coaching individuel", description: "Deux sessions de 1h par participant clé pour ancrer les pratiques sur le terrain." },
  { title: "Bilan d'impact", description: "Restitution à 90 jours avec les indicateurs définis au cadrage." },
];

export default function AdvancedTraining() {
  return (
    <>
      <PageHero
        index="II"
        kicker="Formation · Niveau 2"
        title={<>Faire monter <span className="italic text-muted-foreground">l&apos;encadrement.</span></>}
        lede="Un parcours pensé pour les chefs d'équipe, managers de proximité et responsables commerciaux qui doivent passer du « faire » au « faire faire »."
        meta={[
          { label: "Durée", value: "3 jours" },
          { label: "Effectif", value: "6–10 pers." },
          { label: "Format", value: "Présentiel + coaching" },
          { label: "Suivi", value: "90 jours" },
        ]}
      />

      <section className="container mx-auto px-6 lg:px-10 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <SectionHeading
              index="02"
              kicker="Programme"
              title={<>Six modules <span className="italic text-muted-foreground">d&apos;encadrement.</span></>}
              lede="Les compétences qu&apos;on n&apos;apprend pas dans les manuels : gérer un conflit en français et en malgache, piloter par le chiffre, relancer sans casser la relation."
            />
          </div>
          <div className="lg:col-span-7">
            <Checklist items={modules} />
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="container mx-auto px-6 lg:px-10 py-24 md:py-32">
          <SectionHeading
            index="03"
            kicker="Parcours"
            title={<>Un format <span className="italic text-muted-foreground">séminaire + coaching.</span></>}
            lede="La formation seule ne change pas les habitudes. C'est le coaching individuel qui fait la différence, semaine après semaine."
          />
          <div className="mt-16">
            <Steps steps={steps} />
          </div>
        </div>
      </section>

      <CTABlock
        kicker="Vos managers méritent ce cadre"
        title={<>Construisons <span className="italic">votre promotion.</span></>}
        primary={{ href: "/contact", label: "Demander le programme détaillé" }}
        secondary={{ href: "/training/specialized", label: "Voir la formation spécialisée" }}
      />
    </>
  );
}
