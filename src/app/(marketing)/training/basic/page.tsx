import { Checklist, CTABlock, PageHero, SectionHeading, StatBand, Steps } from "@/components/brand";

export const metadata = {
  title: "Formation de base",
  description:
    "Les fondamentaux métier pour les équipes opérationnelles : accueil client, vente, gestion de stock, recouvrement.",
};

const modules = [
  "Accueil physique et téléphonique",
  "Techniques de vente et d'écoute client",
  "Bases du recouvrement amiable",
  "Gestion de stock : inventaires, rotations, FIFO",
  "Hygiène, sécurité et comportement en atelier",
  "Communication écrite professionnelle (mail, rapport)",
];

const steps = [
  { title: "Diagnostic", description: "Demi-journée sur site pour cerner les écarts de compétence et aligner le programme." },
  { title: "Session", description: "Deux jours de formation en présentiel, groupes de 8 à 12 personnes." },
  { title: "Mise en pratique", description: "Cas concrets tirés de votre activité, jeux de rôles, supports à emporter." },
  { title: "Suivi", description: "Un entretien post-formation à 30 jours pour mesurer l'ancrage des acquis." },
];

export default function BasicTraining() {
  return (
    <>
      <PageHero
        index="I"
        kicker="Formation · Niveau 1"
        title={<>Les fondamentaux, <span className="italic text-muted-foreground">bien posés.</span></>}
        lede="Un socle opérationnel pour les équipes qui rencontrent le client, gèrent le stock ou tiennent la caisse. Pragmatique, sans théorie superflue."
        meta={[
          { label: "Durée", value: "2 jours" },
          { label: "Effectif", value: "8–12 pers." },
          { label: "Format", value: "Présentiel" },
          { label: "Langues", value: "FR · MG" },
        ]}
      />

      <section className="container mx-auto px-6 lg:px-10 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <SectionHeading
              index="02"
              kicker="Programme"
              title={<>Six modules <span className="italic text-muted-foreground">actionnables.</span></>}
              lede="Chaque module se clôt par une simulation notée : nous vérifions ce que chaque participant repart vraiment savoir faire."
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
            kicker="Méthode"
            title={<>Quatre étapes, <span className="italic text-muted-foreground">du diagnostic au suivi.</span></>}
          />
          <div className="mt-16">
            <Steps steps={steps} />
          </div>
        </div>
      </section>

      <StatBand
        caption="Résultats observés"
        stats={[
          { value: "93", suffix: "%", label: "Taux de satisfaction participant" },
          { value: "8.6", suffix: "/10", label: "Note d'utilité perçue" },
          { value: "30", suffix: "j", label: "Suivi post-session" },
          { value: "40", suffix: "+", label: "Entreprises formées" },
        ]}
      />

      <CTABlock
        kicker="Prêt à former votre équipe ?"
        title={<>Une date en tête ? <span className="italic">Réservons-la.</span></>}
        primary={{ href: "/contact", label: "Planifier une session" }}
        secondary={{ href: "/training/advanced", label: "Voir la formation avancée" }}
      />
    </>
  );
}
