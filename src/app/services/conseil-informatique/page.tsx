"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { BarChart, Palette, Code, Lightbulb } from "lucide-react";



/* eslint-disable react/no-unescaped-entities */
export default function ConseilInformatique() {
  const services = [
    {
      title: "Analyse de données",
      description: "Exploitation et analyse approfondie de vos données pour des insights stratégiques.",
      icon: <BarChart className="w-10 h-10 text-primary" />,
    },
    {
      title: "Design",
      description: "Création d'interfaces utilisateur intuitives et d'expériences utilisateur optimales.",
      icon: <Palette className="w-10 h-10 text-primary" />,
    },
    {
      title: "Développement web",
      description: "Développement d'applications web et de microservices sur mesure pour votre entreprise.",
      icon: <Code className="w-10 h-10 text-primary" />,
    },
    {
      title: "Solutions numériques",
      description: "Solutions technologiques personnalisées et adaptées à vos objectifs spécifiques.",
      icon: <Lightbulb className="w-10 h-10 text-primary" />,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16 mt-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
          Conseil et Services Informatiques
        </h1>
        <p className="text-xl text-center text-muted-foreground mb-12">
          Solutions numériques adaptées à vos objectifs
        </p>
      </motion.div>

      <div className="relative h-[400px] w-full mb-16 rounded-xl overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
          alt="Digital Transformation"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-white text-center max-w-2xl p-6">
            <h2 className="text-3xl font-bold mb-4">
              Services Informatiques Professionnels
            </h2>
            <p className="text-lg">
              De l'analyse de données au développement web, nous vous accompagnons dans tous vos projets numériques
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="p-6 h-full hover:shadow-lg transition-shadow dark:bg-background/95 dark:border-primary/20">
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-2xl font-semibold mb-3">{service.title}</h3>
              <p className="text-muted-foreground">{service.description}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold mb-6">Besoin d'une solution informatique ?</h2>
        <Button size="lg" asChild className="hover:bg-primary hover:text-primary-foreground dark:border-primary/50">
          <Link href="/contact/devis">Demander un devis</Link>
        </Button>
      </motion.div>
    </div>
  );
}