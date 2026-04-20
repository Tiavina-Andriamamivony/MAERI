import Image from "next/image";
import {
  CTABlock,
  FeatureGrid,
  PageHero,
  SectionHeading,
  StatBand,
} from "@/components/brand";
import { HardHat, Layers, Shield, Ruler } from "lucide-react";

export const metadata = {
  title: "Matériaux de construction",
  description:
    "Fer, ciment, tôles, isolation, quincaillerie — les matériaux essentiels pour vos chantiers et sites industriels.",
};

const families = [
  {
    index: "01",
    title: "Gros œuvre",
    description:
      "Fer à béton, ciment CPA 42.5, agrégats, parpaings. Livraison directe sur chantier, volumes ajustables au planning.",
    icon: <HardHat className="h-5 w-5" />,
  },
  {
    index: "02",
    title: "Toiture & bardage",
    description:
      "Tôles ondulées et nervurées, bacs acier, accessoires de faîtage. Épaisseurs et coloris au choix.",
    icon: <Layers className="h-5 w-5" />,
  },
  {
    index: "03",
    title: "Étanchéité & isolation",
    description:
      "Membranes bitumineuses, mousse polyuréthane, laine de roche. Conseil en mise en œuvre inclus.",
    icon: <Shield className="h-5 w-5" />,
  },
  {
    index: "04",
    title: "Quincaillerie technique",
    description:
      "Visserie, fixations lourdes, cornières, profilés. Références industrielles pour applications exigeantes.",
    icon: <Ruler className="h-5 w-5" />,
  },
];

export default function ConstructionMaterials() {
  return (
    <>
      <PageHero
        index="→"
        kicker="Produits · Construction"
        title={<>La matière <span className="italic text-muted-foreground">qui tient.</span></>}
        lede="Des matériaux de construction sélectionnés pour les chantiers industriels et les bâtiments qui doivent durer vingt ans."
        meta={[
          { label: "Familles", value: "04" },
          { label: "Références", value: "60+" },
          { label: "Délai moyen", value: "5 jours" },
          { label: "Zone", value: "Madagascar" },
        ]}
      />

      <section className="container mx-auto px-6 lg:px-10 py-24 md:py-32">
        <SectionHeading
          index="02"
          kicker="Familles de produits"
          title={<>Du gros œuvre à la finition, <span className="italic text-muted-foreground">en un seul bon de commande.</span></>}
          lede="Nous consolidons vos besoins sur un catalogue unique pour simplifier vos achats et réduire les retards de chantier."
        />
        <div className="mt-16">
          <FeatureGrid columns={4} features={families} />
        </div>
      </section>

      <section className="container mx-auto px-6 lg:px-10 pb-24">
        <div className="relative aspect-[21/9] overflow-hidden bg-muted border border-border">
          <Image
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop"
            alt="Chantier industriel"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </section>

      <StatBand
        caption="Notre chaîne logistique"
        stats={[
          { value: "72", suffix: "h", label: "Délai moyen sur Antananarivo" },
          { value: "12", label: "Fournisseurs référencés" },
          { value: "100", suffix: "%", label: "Produits traçables" },
          { value: "24", suffix: "/7", label: "Support commandes urgentes" },
        ]}
      />

      <CTABlock
        kicker="Votre prochain chantier"
        title={<>Envoyez-nous <span className="italic">votre bordereau.</span></>}
        description="Nous chiffrons sous 24 heures et confirmons la disponibilité ligne par ligne."
        primary={{ href: "/contact", label: "Demander un devis" }}
        secondary={{ href: "/products/industrial-pipes", label: "Voir les tuyaux industriels" }}
      />
    </>
  );
}
