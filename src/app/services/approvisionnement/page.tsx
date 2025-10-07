"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { CheckCircle2, Package, Truck, PiggyBank } from 'lucide-react';

const products = [
  {
    name: "Rouleaux métalliques",
    image: "https://images.unsplash.com/photo-1581093458791-9d66bc573a36?w=500&auto=format&fit=crop&q=60",
    description: "Pour vos applications industrielles"
  },
  {
    name: "Roulements et courroies",
    image: "https://images.unsplash.com/photo-1581093458791-9d66bc573a36?w=500&auto=format&fit=crop&q=60",
    description: "Trapézoïdales et plates pour systèmes mécaniques"
  },
  {
    name: "Para-huile et joints",
    image: "https://images.unsplash.com/photo-1581093458791-9d66bc573a36?w=500&auto=format&fit=crop&q=60",
    description: "Garantie d'étanchéité optimale"
  },
  {
    name: "Tuyaux et accessoires",
    image: "https://images.unsplash.com/photo-1581093458791-9d66bc573a36?w=500&auto=format&fit=crop&q=60",
    description: "Pour tous types de fluides et pressions"
  },
  {
    name: "Vannes industrielles",
    image: "https://images.unsplash.com/photo-1581093458791-9d66bc573a36?w=500&auto=format&fit=crop&q=60",
    description: "Contrôle précis de vos circuits"
  },
  {
    name: "Moteurs électriques",
    image: "https://images.unsplash.com/photo-1581093458791-9d66bc573a36?w=500&auto=format&fit=crop&q=60",
    description: "Performance et fiabilité garanties"
  }
];

const advantages = [
  { 
    icon: <Package className="w-8 h-8" />, 
    title: "Qualité Premium", 
    desc: "Produits sélectionnés selon des standards rigoureux" 
  },
  { 
    icon: <Truck className="w-8 h-8" />, 
    title: "Livraison Rapide", 
    desc: "Service de livraison efficace et ponctuel" 
  },
  { 
    icon: <PiggyBank className="w-8 h-8" />, 
    title: "Prix Compétitifs", 
    desc: "Meilleur rapport qualité-prix du marché" 
  }
];

export default function ApprovisionnementPage() {
  return (
    <div className="min-h-screen pt-24 px-4 md:px-8">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto text-center mb-16 mt-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          Approvisionnement Industriel
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground">
          Chez MAERI Consulting, nous accompagnons toutes les entreprises dans leurs besoins 
          d'approvisionnement en matières premières et équipements industriels.
        </p>
      </motion.div>

      {/* Avantages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
        {advantages.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            className="p-6 rounded-xl border bg-card shadow-lg hover:shadow-xl transition-all"
          >
            <div className="mb-4 text-primary">{item.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-muted-foreground">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Produits Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto mb-16"
      >
        <h2 className="text-3xl font-bold text-center mb-12">Nos Produits et Équipements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-xl border bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-square relative">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="absolute bottom-0 w-full p-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                    <span className="font-medium text-white">{product.name}</span>
                  </div>
                  <p className="text-sm text-gray-200">{product.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto text-center pb-16"
      >
        <h2 className="text-2xl font-bold mb-6">Prêt à optimiser votre approvisionnement ?</h2>
        <button className="px-8 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 cursor-pointer">
          Contactez-nous
        </button>
      </motion.div>
    </div>
  );
}