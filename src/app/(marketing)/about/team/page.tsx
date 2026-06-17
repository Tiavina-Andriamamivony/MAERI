import Image from "next/image";
import { CTABlock, Kicker, PageHero, SectionHeading } from "@/components/brand";

export const metadata = {
  title: "Notre équipe",
  description:
    "L'équipe de MA-ERI Consulting : profils industriels, pédagogiques et techniques au service des PME.",
};

type Member = {
  name: string;
  role: string;
  bio: string;
  image: string;
};

const team: Member[] = [
  {
    name: "Direction industrielle",
    role: "Approvisionnement & sourcing",
    bio: "Vingt ans de négociation fournisseurs entre Madagascar, Maurice et l'Asie du Sud-Est. Responsable des achats critiques et du contrôle qualité.",
    image:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Direction pédagogique",
    role: "Formation professionnelle",
    bio: "Ancienne responsable RH dans l'industrie textile. Conçoit des programmes courts, opérationnels, adaptés à la réalité des équipes malgaches.",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Direction technique",
    role: "Conseil informatique & digital",
    bio: "Ingénieur produit. Microservices, data, UI/UX. Privilégie les outils simples qui survivent au départ de leur créateur.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Relation clients",
    role: "Commercial & devis",
    bio: "Point d'entrée unique pour toutes vos demandes. Chiffre, coordonne, suit dans le temps — pour que vous n'ayez qu'un seul numéro à composer.",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=800&auto=format&fit=crop",
  },
];

export default function Team() {
  return (
    <>
      <PageHero
        index="→"
        kicker="À propos · L'équipe"
        title={<>Des profils <span className="italic text-muted-foreground">complémentaires,</span> un seul cap.</>}
        lede="L'ADN de MA-ERI, c'est le croisement de trois métiers — industrie, pédagogie, ingénierie logicielle — sous un même toit."
        meta={[
          { label: "Pôles métiers", value: "04" },
          { label: "Siège", value: "Toamasina" },
          { label: "Présence", value: "Madagascar" },
        ]}
      />

      <section className="container mx-auto px-6 lg:px-10 py-24 md:py-32">
        <SectionHeading
          index="02"
          kicker="L'équipe"
          title={<>Quatre directions, <span className="italic text-muted-foreground">un seul interlocuteur</span> par compte.</>}
        />

        <ul className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border">
          {team.map((m) => (
            <li key={m.name} className="bg-background">
              <article className="p-8 md:p-10 flex flex-col gap-6">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <Image
                    src={m.image}
                    alt={m.name}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <Kicker accent>{m.role}</Kicker>
                  <h3 className="font-display text-2xl md:text-3xl font-medium leading-tight">
                    {m.name}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{m.bio}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <CTABlock
        kicker="Rejoindre l'équipe"
        title={<>Nous recrutons les profils <span className="italic">qui s&apos;impliquent.</span></>}
        description="Commercial, logistique, formation, développement : nous étudions toute candidature sérieuse liée à nos métiers."
        primary={{ href: "/contact", label: "Envoyer une candidature" }}
      />
    </>
  );
}
