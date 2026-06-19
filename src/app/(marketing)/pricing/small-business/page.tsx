import { CTABlock, PageHero, PricingCard, SectionHeading, type PricingTier } from "@/components/brand";

export const metadata = {
  title: "Tarifs — Petites entreprises",
  description:
    "Formule MA-ERI adaptée aux petites entreprises malgaches : approvisionnement ponctuel, sessions courtes, outils simples.",
};

const tiers: PricingTier[] = [
  {
    name: "Atelier",
    kicker: "PME — < 10 personnes",
    lede:
      "Pour les petites structures qui ont besoin d'un partenaire fiable sans contrat lourd. Sur devis, à la demande.",
    price: "Sur devis",
    priceFootnote: "À partir de 450 000 Ar / intervention",
    highlight: true,
    features: [
      "Approvisionnement ponctuel (1 à 5 références)",
      "Une session de formation courte (1 jour, 8 participants max)",
      "Un audit digital léger (2h, restitution écrite)",
      "Interlocuteur unique, joignable par WhatsApp",
      "Facturation à la commande, sans abonnement",
    ],
    cta: { href: "/contact", label: "Demander un devis" },
  },
  {
    name: "Ligne",
    kicker: "PME — 10 à 50 personnes",
    lede:
      "Pour les entreprises qui commencent à structurer leurs achats et leur montée en compétence.",
    price: "Sur devis",
    priceSuffix: "selon volume",
    features: [
      "Catalogue permanent de 20 à 50 références",
      "Programme de formation annuel (4 sessions)",
      "Application métier sur mesure, livrée en 4 à 8 semaines",
      "Réunion de suivi trimestrielle",
      "Priorité sur les demandes urgentes",
    ],
    cta: { href: "/pricing/medium-business", label: "Voir la formule Ligne" },
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
      "Plateforme digitale dédiée, intégrée à vos SI",
      "Comité de pilotage mensuel",
      "Astreinte téléphonique dédiée",
    ],
    cta: { href: "/pricing/large-business", label: "Voir la formule Groupe" },
  },
];

export default function SmallBusiness() {
  return (
    <>
      <PageHero
        index="I"
        kicker="Tarifs · Atelier"
        title={<>Une formule <span className="italic text-muted-foreground">à la demande</span>, pensée pour les petites structures.</>}
        lede="Pas d'abonnement, pas d'engagement. Vous nous sollicitez quand vous en avez besoin, nous chiffrons, nous livrons."
        meta={[
          { label: "Format", value: "Ponctuel" },
          { label: "Ticket d'entrée", value: "450k Ar" },
          { label: "Engagement", value: "Aucun" },
        ]}
      />

      <section className="container mx-auto px-6 lg:px-10 py-24 md:py-32">
        <SectionHeading
          index="02"
          kicker="Les trois formules"
          title={<>Choisissez l&apos;échelle <span className="italic text-muted-foreground">qui vous ressemble.</span></>}
          lede="Trois niveaux d'engagement. Vous pouvez passer de l'un à l'autre à tout moment, sans rupture de relation."
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border">
          {tiers.map((t) => (
            <PricingCard key={t.name} tier={t} className="border-0" />
          ))}
        </div>

        <p className="mt-10 text-sm text-muted-foreground max-w-2xl">
          Les montants sont indicatifs et en ariary malgache (Ar). Tout devis
          précise le périmètre, les livrables et les délais avant démarrage.
        </p>
      </section>

      <CTABlock
        kicker="Prêt à démarrer"
        title={<>Un besoin précis ? <span className="italic">Chiffrons-le.</span></>}
        primary={{ href: "/contact", label: "Obtenir un devis" }}
        secondary={{ href: "/services", label: "Tous nos services" }}
      />
    </>
  );
}
