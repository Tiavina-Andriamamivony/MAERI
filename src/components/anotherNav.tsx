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
            <HoveredLink href="/services/professional-training">Formation professionnelle</HoveredLink>
            <HoveredLink href="/services/conseil-informatique">
              Conseil informatique et Digital
            </HoveredLink>
            <HoveredLink href="/services/raw-material-supply">Approvisionnement matières premières</HoveredLink>
            <HoveredLink href="/services/supplier-networking">Réseau de fournisseurs</HoveredLink>
          </div>
        </MenuItem>
        
        {/* Products Section */}
        <MenuItem setActive={setActive} active={active} item="Produits">
          <div className="text-sm grid grid-cols-2 gap-10 p-4">
            <ProductItem
              title="Matériaux de construction"
              href="/products/construction-materials"
              src="https://i.pinimg.com/474x/3a/a7/48/3aa7483999c8d159e37331dd626e11fc.jpg"
              description="Matériaux de qualité pour vos projets de construction."
            />
            <ProductItem
              title="Tuyaux industriels"
              href="/products/industrial-pipes"
              src="https://i.pinimg.com/474x/aa/cb/6d/aacb6dd4af7e313394a15a0b9da27cb1.jpg"
              description="Solutions complètes de tuyauterie industrielle."
            />
            <ProductItem
              title="Équipements spécialisés"
              href="/products/specialized-equipment"
              src="https://i.pinimg.com/474x/63/31/ec/6331ec4b7b5b53b3ec175ae968187449.jpg"
              description="Équipements de pointe pour l'industrie."
            />
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Formation">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/training/basic">Formation de base</HoveredLink>
            <HoveredLink href="/training/advanced">Formation avancée</HoveredLink>
            <HoveredLink href="/training/specialized">Formation spécialisée</HoveredLink>
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
        <Link href="/contact">Contact</Link>


        <br />

        <ModeToggle />
      </Menu>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-background/95 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center h-full space-y-6 text-lg overflow-y-auto py-8">
            <Link href="/" className="cursor-pointer">
              <HomeIcon className="w-6 h-6" />
            </Link>
            
            <div className="flex flex-col items-center space-y-4">
              <span className="font-semibold">Services</span>
              <Link href="/services/approvisionnement" className="text-sm">Approvisionnement</Link>
              <Link href="/services/professional-training" className="text-sm">Formation</Link>
              <Link href="/services/conseil-informatique" className="text-sm">Conseil IT</Link>
              <Link href="/services/raw-material-supply" className="text-sm">Matières premières</Link>
              <Link href="/services/supplier-networking" className="text-sm">Réseau fournisseurs</Link>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <span className="font-semibold">Produits</span>
              <Link href="/products/construction-materials" className="text-sm">Matériaux construction</Link>
              <Link href="/products/industrial-pipes" className="text-sm">Tuyaux industriels</Link>
              <Link href="/products/specialized-equipment" className="text-sm">Équipements spécialisés</Link>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <span className="font-semibold">Tarifs</span>
              <Link href="/pricing/small-business" className="text-sm">Petites entreprises</Link>
              <Link href="/pricing/medium-business" className="text-sm">Moyennes entreprises</Link>
              <Link href="/pricing/large-business" className="text-sm">Grandes entreprises</Link>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <span className="font-semibold">Formation</span>
              <Link href="/training/basic" className="text-sm">Formation de base</Link>
              <Link href="/training/advanced" className="text-sm">Formation avancée</Link>
              <Link href="/training/specialized" className="text-sm">Formation spécialisée</Link>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <span className="font-semibold">Contact</span>
              <Link href="/contact/general" className="text-sm">Contact général</Link>
              <Link href="/contact/support" className="text-sm">Support technique</Link>
              <Link href="/contact/sales" className="text-sm">Service commercial</Link>
            </div>
            
            <ModeToggle />
          </div>
        </div>
      )}
    </div>
  );
}