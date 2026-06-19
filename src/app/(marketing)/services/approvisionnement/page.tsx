import Image from "next/image";
import { CTABlock, FeatureGrid, PageHero, SectionHeading, StatBand } from "@/components/brand";
import { Truck, Package, PiggyBank, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Approvisionnement industriel",
  description:
    "Roulements, courroies, joints, tuyaux, vannes, moteurs électriques et pompes hydrauliques — l'approvisionnement industriel MA-ERI.",
};

const catalogue = [
  {
    name: "Rouleaux métalliques",
    image:
      "https://images.unsplash.com/photo-1581093458791-9d66bc573a36?w=800&auto=format&fit=crop&q=60",
    hint: "Applications industrielles lourdes",
  },
  {
    name: "Roulements & courroies",
    image:
      "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=800&auto=format&fit=crop&q=60",
    hint: "Trapézoïdales, plates, multi-nervures",
  },
  {
    name: "Para-huile & joints",
    image:
      "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=800&auto=format&fit=crop&q=60",
    hint: "Étanchéité dynamique et statique",
  },
  {
    name: "Tuyaux & vannes",
    image:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=60",
    hint: "Fluides industriels, eau, vapeur",
  },
  {
    name: "Moteurs électriques",
    image:
      "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=800&auto=format&fit=crop&q=60",
    hint: "Triphasés IE2 / IE3, 0,37–250 kW",
  },
  {
    name: "Pompes hydrauliques",
    image:
      "https://images.unsplash.com/photo-1581094481246-2d1d9e2e7c6b?w=800&auto=format&fit=crop&q=60",
    hint: "Centrifuges, volumétriques, doseuses",
  },
];

const why = [
  {
    index: "01",
    title: "Sélection stricte",
    description:
      "Nos fournisseurs sont audités sur documents et sur échantillons. Pas de référence approximative.",
    icon: <CheckCircle2 className="h-5 w-5" />,
  },
  {
    index: "02",
    title: "Livraison maîtrisée",
    description:
      "Logistique intégrée du port de Toamasina à vos sites. Délais engagés, pas indicatifs.",
    icon: <Truck className="h-5 w-5" />,
  },
  {
    index: "03",
    title: "Stock avancé possible",
    description:
      "Pour vos pièces critiques, une réserve de sécurité peut être négociée chez notre partenaire logistique.",
    icon: <Package className="h-5 w-5" />,
  },
  {
    index: "04",
    title: "Prix transparents",
    description:
      "Devis ligne par ligne, incoterms précisés, taxes détaillées. Vous voyez le coût complet dès la proposition.",
    icon: <PiggyBank className="h-5 w-5" />,
  },
];

export default function Approvisionnement() {
  return (
    <>
      <PageHero
        index="→"
        kicker="Services · Approvisionnement industriel"
        title={<>La bonne pièce, <span className="italic text-muted-foreground">au bon endroit,</span> au bon moment.</>}
        lede="Une chaîne d'approvisionnement industriel pensée pour les PME malgaches : large catalogue, livraison rapide, prix transparents."
        meta={[
          { label: "Familles", value: "06" },
          { label: "Stock partenaire", value: "300+ ref" },
          { label: "Délai cible", value: "≤ 7 jours" },
          { label: "Zone", value: "Madagascar" },
        ]}
      />

      <section className="container mx-auto px-6 lg:px-10 py-24 md:py-32">
        <SectionHeading
          index="02"
          kicker="Catalogue"
          title={<>Six familles, <span className="italic text-muted-foreground">couvrant l&apos;essentiel</span> de vos besoins.</>}
        />

        <ul className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
          {catalogue.map((p, i) => (
            <li key={p.name} className="bg-background group">
              <article className="flex flex-col">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex flex-col gap-2">
                  <span className="kicker tabular-nums">
                    {String(i + 1).padStart(2, "0")} — Référence
                  </span>
                  <h3 className="font-display text-xl md:text-2xl font-medium leading-tight">
                    {p.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{p.hint}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-border">
        <div className="container mx-auto px-6 lg:px-10 py-24 md:py-32">
          <SectionHeading
            index="03"
            kicker="Pourquoi nous"
            title={<>Quatre convictions, <span className="italic text-muted-foreground">quatre gestes concrets.</span></>}
          />
          <div className="mt-16">
            <FeatureGrid columns={4} features={why} />
          </div>
        </div>
      </section>

      <StatBand
        caption="Chiffres clés"
        stats={[
          { value: "300", suffix: "+", label: "Références disponibles" },
          { value: "98", suffix: "%", label: "Commandes livrées complètes" },
          { value: "07", suffix: "j", label: "Délai cible standard" },
          { value: "24", suffix: "h", label: "Délai devis urgent" },
        ]}
      />

      <CTABlock
        kicker="Besoin d'une pièce précise ?"
        title={<>Référence en main ? <span className="italic">Devis en 24h.</span></>}
        description="Transmettez-nous votre plaque signalétique, votre référence constructeur ou votre photo. Nous revenons avec un chiffrage précis et les délais confirmés."
        primary={{ href: "/contact", label: "Demander un devis" }}
        secondary={{ href: "/products/specialized-equipment", label: "Voir les équipements" }}
      />
    </>
  );
}
