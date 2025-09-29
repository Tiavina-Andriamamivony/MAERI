"use client";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./theme-button";
import { HomeIcon, Menu as MenuIcon, X } from "lucide-react";
import Link from "next/link";

export default function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden absolute right-4 top-2 z-50"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MenuIcon className="w-6 h-6" />
        )}
      </button>

      {/* Desktop Menu */}
      <div className="hidden lg:block">
      <Menu setActive={setActive} >
        <Link href="/" className="z-50 cursor-pointer">
          <HomeIcon className="hover:border-b-2 hover:border-current transition-all duration-200"/>
        </Link>
      
        
        {/* Services Section */}
        <MenuItem setActive={setActive} active={active} item="Services" >
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/services/approvisionnement">Approvisionnement industriel</HoveredLink>
            <HoveredLink href="/services/formation">Formation professionnelle</HoveredLink>
            <HoveredLink href="/services/conseil-informatique">
              Conseil informatique et Digital
            </HoveredLink>
            <HoveredLink href="/services/sourcing">Sourcing local et international</HoveredLink>
          </div>
          
        </MenuItem>
        
        {/* Products Section */}
        <MenuItem setActive={setActive} active={active} item="Produits">
          <div className="text-sm grid grid-cols-2 gap-10 p-4">
            <ProductItem
              title="Équipements industriels"
              href="/products/equipements-industriels"
              src="https://i.pinimg.com/474x/3a/a7/48/3aa7483999c8d159e37331dd626e11fc.jpg"
              description="Rouleaux métalliques, roulements, courroies, pompes hydrauliques."
            />
            <ProductItem
              title="Matières premières"
              href="/products/matieres-premieres"
              src="https://i.pinimg.com/474x/aa/cb/6d/aacb6dd4af7e313394a15a0b9da27cb1.jpg"
              description="Large gamme de matières premières industrielles."
            />
            <ProductItem
              title="Accessoires techniques"
              href="/products/accessoires-techniques"
              src="https://i.pinimg.com/474x/63/31/ec/6331ec4b7b5b53b3ec175ae968187449.jpg"
              description="Joints, para-huile, tuyaux, vannes, moteurs électriques."
            />
          </div>
        </MenuItem>

        {/* Pricing Section */}
        <MenuItem setActive={setActive} active={active} item="Tarifs">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/pricing/start-up">Start-ups</HoveredLink>
            <HoveredLink href="/pricing/pme">PME</HoveredLink>
            <HoveredLink href="/pricing/grands-groupes">Grands groupes</HoveredLink>
          </div>
        </MenuItem>

        <MenuItem setActive={setActive} active={active} item="Formation">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/training/accueil-client">Accueil client</HoveredLink>
            <HoveredLink href="/training/vente-negociation">Vente et négociation</HoveredLink>
            <HoveredLink href="/training/management-leadership">Management et leadership</HoveredLink>
            <HoveredLink href="/training/recouvrement">Techniques de recouvrement</HoveredLink>
            <HoveredLink href="/training/gestion-stock">Gestion de stock</HoveredLink>
          </div>
        </MenuItem>

        {/* About Us Section */}
        <MenuItem setActive={setActive} active={active} item="À propos">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/about/histoire">Notre histoire</HoveredLink>
            <HoveredLink href="/about/equipe">Notre équipe</HoveredLink>
            <HoveredLink href="/about/mission">Notre mission</HoveredLink>
            <HoveredLink href="/about/partenaire-confiance">Partenaire de confiance</HoveredLink>
          </div>
        </MenuItem>

        {/* Contact Section */}
        <MenuItem setActive={setActive} active={active} item="Contact">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/contact/general">Contact général</HoveredLink>
            <HoveredLink href="/contact/support">Support technique</HoveredLink>
            <HoveredLink href="/contact/commercial">Service commercial</HoveredLink>
            <HoveredLink href="/contact/devis">Demande de devis</HoveredLink>
          </div>
        </MenuItem>


        <br />

        <ModeToggle />
      </Menu>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-background/95 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center h-full space-y-6 text-lg">
            <Link href="/" className="cursor-pointer">
              <HomeIcon className="w-6 h-6" />
            </Link>
            
            <Link href="/services" className="z-50 cursor-pointer hover:border-b-2 hover:border-current transition-all duration-200">Services</Link>
            <Link href="/products" className="z-50 cursor-pointer hover:border-b-2 hover:border-current transition-all duration-200">Produits</Link>
            <Link href="/pricing" className="z-50 cursor-pointer hover:border-b-2 hover:border-current transition-all duration-200">Tarifs</Link>
            <Link href="/training" className="z-50 cursor-pointer hover:border-b-2 hover:border-current transition-all duration-200">Formation</Link>
            <Link href="/about" className="z-50 cursor-pointer hover:border-b-2 hover:border-current transition-all duration-200">À propos</Link>
            <Link href="/contact" className="z-50 cursor-pointer hover:border-b-2 hover:border-current transition-all duration-200">Contact</Link>
            
            <ModeToggle />
          </div>
        </div>
      )}
    </div>
  );
}