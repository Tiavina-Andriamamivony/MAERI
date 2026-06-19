import { CTABlock, PageHero, PricingCard, SectionHeading, type PricingTier } from "@/components/brand";

export const metadata = {
  title: "Tarifs — Grandes entreprises",
  description:
    "Formule MA-ERI pour les ETI et grands groupes : contrat-cadre multi-sites, académie interne, plateforme dédiée.",
};

const tiers: PricingTier[] = [
  {
    name: "Atelier",
    kicker: "PME — < 10 personnes",
    lede: "Pour les petites structures. Ponctuel, sans engagement.",
    price: "Sur devis",
    priceFootnote: "À partir de 450 000 Ar",
    features: [
      "Approvisionnement ponctuel",
      "Session de formation courte",
      "Audit digital léger",
    ],
    cta: { href: "/pricing/small-business", label: "Voir Atelier" },
  },
  {
    name: "Ligne",
    kicker: "PME — 10 à 50 personnes",
    lede: "Pour les entreprises qui structurent leur chaîne d'achat et leur montée en compétence.",
    price: "Sur devis",
    priceSuffix: "selon volume",
    features: [
      "Catalogue permanent",
      "Plan de formation annuel",
      "Outil métier sur mesure",
      "Suivi trimestriel",
    ],
    cta: { href: "/pricing/medium-business", label: "Voir Ligne" },
  },
  {
    name: "Groupe",
    kicker: "ETI & grandes entreprises",
    lede:
      "Un partenariat contractualisé, multi-sites, avec astreinte dédiée et plateforme intégrée à vos systèmes existants.",
    price: "Sur mesure",
    priceFootnote: "Contrat pluriannuel — engagement minimum 12 mois",
    highlight: true,
    features: [
      "Contrat-cadre multi-sites (Madagascar et océan Indien)",
      "Académie de formation interne, référentiel de compétences dédié",
      "Plateforme digitale dédiée, intégrée à vos SI (ERP, GMAO, RH)",
      "Comité de pilotage mensuel avec la direction MA-ERI",
      "Astreinte téléphonique 6j / 7 pour les lignes critiques",
      "SLA d'approvisionnement et de support formalisés",
    ],
    cta: { href: "/contact", label: "Demander une rencontre" },
  },
];

export default function LargeBusiness() {
  return (
    <>
      <PageHero
        index="III"
        kicker="Tarifs · Groupe"
        title={<>Un partenariat <span className="italic text-muted-foreground">structuré,</span> à l&apos;échelle de vos sites.</>}
        lede="Contrat-cadre, académie interne, plateforme digitale dédiée, astreinte. Le niveau d'exigence des groupes industriels."
        meta={[
          { label: "Profil", value: "ETI / Grp" },
          { label: "Durée", value: "12–36 mois" },
          { label: "Astreinte", value: "6j / 7" },
        ]}
      />

      <section className="container mx-auto px-6 lg:px-10 py-24 md:py-32">
        <SectionHeading
          index="02"
          kicker="Les trois formules"
          title={<>Groupe, <span className="italic text-muted-foreground">sur mesure intégral.</span></>}
          lede="Chaque périmètre est unique. Nous construisons le contrat autour de votre organisation, pas l'inverse."
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border">
          {tiers.map((t) => (
            <PricingCard key={t.name} tier={t} className="border-0" />
          ))}
        </div>
      </section>

      <CTABlock
        kicker="Parlons à votre direction"
        title={<>Un rendez-vous <span className="italic">sur site,</span> pour commencer.</>}
        description="Nous nous déplaçons. Une demi-journée dans vos locaux nous suffit pour formaliser une proposition chiffrée."
        primary={{ href: "/contact", label: "Organiser la visite" }}
        secondary={{ href: "/about/mission", label: "Notre approche" }}
      />
    </>
  );
}
