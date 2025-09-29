import { cn } from "@/lib/utils";
import React from "react";
import Image from "next/image";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Services() {
const services = [
    {
      title: "Approvisionnement industriel",
      description: "Large gamme de produits industriels : rouleaux métalliques, roulements, courroies trapézoïdales et plates, joints, para-huile, tuyaux, vannes, moteurs électriques et pompes hydrauliques.",
      image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?q=80&w=2070&auto=format&fit=crop",
      link: "/services/approvisionnement",
      className: "md:col-span-2",
      icon: "🏭"
    },
    {
      title: "Formation professionnelle",
      description: "Programmes complets : accueil client, techniques de vente et négociation, management et leadership, recouvrement, gestion de stock, et mise à disposition d'hôtesses commerciales.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
      link: "/services/formation",
      className: "md:col-span-1",
      icon: "👥"
    },
    {
      title: "Conseil informatique et Digital",
      description: "Solutions numériques sur mesure : analyse de données, design UI/UX, développement d'applications web, microservices et transformation digitale complète.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2070&auto=format&fit=crop",
      link: "/services/conseil-informatique",
      className: "md:col-span-1",
      icon: "💻"
    },
    {
      title: "Sourcing local et international",
      description: "Accès privilégié aux meilleurs fournisseurs mondiaux. Notre expertise en import-export vous garantit des approvisionnements fiables et compétitifs.",
      image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=2070&auto=format&fit=crop",
      link: "/services/sourcing",
      className: "md:col-span-2",
      icon: "🌍"
    }
  ];
  return (
    <div className={cn("container mx-auto px-4 py-8")}>
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mt-44 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50 dark:from-primary dark:to-primary/50">
          Nos Services
        </h1>
        <p className="text-xl text-muted-foreground mb-6">
          Votre partenaire de confiance pour accompagner toutes les entreprises, de la start-up aux grands groupes
        </p>
        <p className="text-base text-muted-foreground">
          Notre mission : fournir les ressources, les compétences et l'expertise nécessaires pour renforcer la performance et la compétitivité de votre entreprise
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {services.map((service, index) => (
          <Card 
            key={index} 
            className={cn(
              "group hover:shadow-xl transition-all duration-300 dark:bg-background/95 dark:border-primary/20 backdrop-blur-sm",
              service.className
            )}
          >
            <div className="relative h-64 w-full overflow-hidden rounded-t-lg">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/10 dark:to-background/20 z-10" />
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover transform group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{service.icon}</span>
                <h3 className="text-2xl font-semibold">{service.title}</h3>
              </div>
              <p className="text-muted-foreground mb-4">{service.description}</p>
              <Button 
              asChild
              variant="outline"
              className="
                hover:bg-primary 
                hover:text-primary-foreground 
                dark:hover:text-white
                transition-colors duration-200 dark:border-primary/50
              "
            >
              <Link href={service.link} className="flex items-center gap-2">
                En savoir plus
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </Button>

            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
