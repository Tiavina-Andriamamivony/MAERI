import { CTABlock, PageHero, PricingCard, SectionHeading, type PricingTier } from "@/components/brand";

export const metadata = {
  title: "Tarifs — Entreprises moyennes",
  description:
    "Formule MA-ERI pour les PME de 10 à 50 personnes : catalogue permanent, programme annuel de formation, outils métier sur mesure.",
};

const tiers: PricingTier[] = [
  {
    name: "Atelier",
    kicker: "PME — < 10 personnes",
    lede:
      "Pour les petites structures qui ont besoin d'un partenaire fiable sans contrat lourd.",
    price: "Sur devis",
    priceFootnote: "À partir de 450 000 Ar / intervention",
    features: [
      "Approvisionnement ponctuel",
      "Session de formation courte",
      "Audit digital léger",
      "Interlocuteur unique",
    ],
    cta: { href: "/pricing/small-business", label: "Voir la formule Atelier" },
  },
  {
    name: "Ligne",
    kicker: "PME — 10 à 50 personnes",
    lede:
      "La formule la plus choisie : structure votre chaîne d'achats, forme vos équipes au long cours et déploie vos premiers outils métiers.",
    price: "Sur devis",
    priceSuffix: "selon volume",
    highlight: true,
    features: [
      "Catalogue permanent de 20 à 50 références",
      "Programme de formation annuel (4 sessions, 12 participants)",
      "Une application métier sur mesure, livrée en 4 à 8 semaines",
      "Réunion de suivi trimestrielle avec votre direction",
      "Priorité sur les demandes urgentes (< 48h)",
      "Tableaux de bord partagés (stock, formation, projets)",
    ],
    cta: { href: "/contact", label: "Démarrer avec Ligne" },
  },
  {
    name: "Groupe",
    kicker: "ETI & grandes entreprises",
    lede:
      "Pour les entreprises multi-sites qui attendent un partenariat structuré et contractualisé.",
    price: "Sur mesure",
    features: [
      "Contrat-cadre multi-sites",
      "Académie de formation interne",
      "Plateforme digitale dédiée",
      "Astreinte téléphonique dédiée",
    ],
    cta: { href: "/pricing/large-business", label: "Voir la formule Groupe" },
  },
];

export default function MediumBusiness() {
  return (
    <>
      <PageHero
        index="II"
        kicker="Tarifs · Ligne"
        title={<>La formule des PME <span className="italic text-muted-foreground">qui passent à l&apos;échelle.</span></>}
        lede="Un catalogue permanent, un plan de formation annuel et un outil métier livré en quelques semaines — le tout piloté par un interlocuteur dédié."
        meta={[
          { label: "Profil", value: "10–50 pers." },
          { label: "Rythme", value: "Annuel" },
          { label: "Suivi", value: "Trimestriel" },
        ]}
      />

      <section className="container mx-auto px-6 lg:px-10 py-24 md:py-32">
        <SectionHeading
          index="02"
          kicker="Les trois formules"
          title={<>Ligne, <span className="italic text-muted-foreground">le juste milieu.</span></>}
          lede="Entre la commande ponctuelle et le contrat-cadre, la plupart de nos clients s'installent ici."
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border">
          {tiers.map((t) => (
            <PricingCard key={t.name} tier={t} className="border-0" />
          ))}
        </div>
      </section>

      <CTABlock
        kicker="Passons à la mise en œuvre"
        title={<>Voyons ensemble <span className="italic">le périmètre exact.</span></>}
        description="Un échange de 30 minutes suffit pour cadrer votre année : volumes d'achat, plan de formation, premier outil métier."
        primary={{ href: "/contact", label: "Planifier un échange" }}
        secondary={{ href: "/services", label: "Détail des services" }}
      />
    </>
  );
}
