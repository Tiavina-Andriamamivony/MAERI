"use client";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./theme-button";

export default function AnotherNav() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <Navbar className="top-2 flex justify-center items-center gap-6 " />
    </div>
  );
}

function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div
      className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}
    >
      <Menu setActive={setActive} >
        {/* Services Section */}
        <MenuItem setActive={setActive} active={active} item="Services">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/raw-material-supply">Fourniture de matières premières</HoveredLink>
            <HoveredLink href="/supplier-networking">Mise en relation avec les fournisseurs</HoveredLink>
            <HoveredLink href="/professional-training">Formations professionnelles</HoveredLink>
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
        <br />

        <ModeToggle />
      </Menu>

      

    </div>
  );
}