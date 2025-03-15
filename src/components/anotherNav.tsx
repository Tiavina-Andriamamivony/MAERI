"use client";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./theme-button";
import { HomeIcon, Menu as MenuIcon, X } from "lucide-react";
import { Button } from "./ui/button";
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
            <HoveredLink href="/services/raw-material-supply">Fourniture de matières premières</HoveredLink>
            <HoveredLink href="/services/supplier-networking">Mise en relation avec les fournisseurs</HoveredLink>
            <HoveredLink href="/services/professional-training">Formations professionnelles</HoveredLink>
          </div>
          
        </MenuItem>
        
        {/* Products Section */}
        <MenuItem setActive={setActive} active={active} item="Produits">
          <div className="text-sm grid grid-cols-2 gap-10 p-4">
            <ProductItem
              title="Tuyaux industriels"
              href="/products/industrial-pipes"
              src="https://i.pinimg.com/474x/3a/a7/48/3aa7483999c8d159e37331dd626e11fc.jpg"
              description="Large gamme de tuyaux pour les entreprises."
            />
            <ProductItem
              title="Matériaux de construction"
              href="/products/construction-materials"
              src="https://i.pinimg.com/474x/aa/cb/6d/aacb6dd4af7e313394a15a0b9da27cb1.jpg"

              description="Matériaux de haute qualité pour vos projets."
            />
            <ProductItem
              title="Équipements spécialisés"
              href="/products/specialized-equipment"
            src="https://i.pinimg.com/474x/63/31/ec/6331ec4b7b5b53b3ec175ae968187449.jpg"

              description="Équipements pour répondre à vos besoins spécifiques."
            />
          </div>
        </MenuItem>

        {/* Pricing Section */}
        <MenuItem setActive={setActive} active={active} item="Tarifs">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/pricing/small-business">Petites entreprises</HoveredLink>
            <HoveredLink href="/pricing/medium-business">Entreprises moyennes</HoveredLink>
            <HoveredLink href="/pricing/large-business">Grandes entreprises</HoveredLink>
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
            <HoveredLink href="/about/history">Notre histoire</HoveredLink>
            <HoveredLink href="/about/team">Notre équipe</HoveredLink>
            <HoveredLink href="/about/mission">Notre mission</HoveredLink>
          </div>
        </MenuItem>

        {/* Contact Section */}
        <MenuItem setActive={setActive} active={active} item="Contact">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/contact/general">Contact général</HoveredLink>
            <HoveredLink href="/contact/support">Support technique</HoveredLink>
            <HoveredLink href="/contact/sales">Service commercial</HoveredLink>
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
            
            <Link href="/services" className= "   z-50 cursor-pointer hover:border-b-2 hover:border-current transition-all duration-200">Services</Link>
            <Link href="/products" className= "   z-50 cursor-pointer hover:border-b-2 hover:border-current transition-all duration-200">Produits</Link>
            <Link href="/pricing" className= "   z-50 cursor-pointer hover:border-b-2 hover:border-current transition-all duration-200">Tarifs</Link>
            <Link href="/training" className= "   z-50 cursor-pointer hover:border-b-2 hover:border-current transition-all duration-200">Formation</Link>
            <Link href="/about" className= "   z-50 cursor-pointer hover:border-b-2 hover:border-current transition-all duration-200">À propos</Link>
            <Link href="/contact" className= "   z-50 cursor-pointer hover:border-b-2 hover:border-current transition-all duration-200">Contact</Link>
            
            <ModeToggle />
          </div>
        </div>
      )}
    </div>
  );
}