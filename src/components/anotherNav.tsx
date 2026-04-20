"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./theme-button";
import { ArrowUpRight, Menu as MenuIcon, X } from "lucide-react";

type NavChild = { href: string; label: string; hint?: string };
type NavItem = {
  label: string;
  href?: string;
  children?: NavChild[];
  kicker?: string;
};

const NAV: NavItem[] = [
  {
    label: "Services",
    kicker: "Ce que nous faisons",
    children: [
      { href: "/services/approvisionnement", label: "Approvisionnement industriel", hint: "Pièces, roulements, moteurs" },
      { href: "/services/raw-material-supply", label: "Matières premières", hint: "Sourcing local & import" },
      { href: "/services/supplier-networking", label: "Réseau fournisseurs", hint: "Mise en relation ciblée" },
      { href: "/services/professional-training", label: "Formation professionnelle", hint: "Vente, management, stock" },
      { href: "/services/conseil-informatique", label: "Conseil informatique", hint: "Data, UI/UX, microservices" },
    ],
  },
  {
    label: "Produits",
    kicker: "Notre catalogue",
    children: [
      { href: "/products/construction-materials", label: "Matériaux de construction" },
      { href: "/products/industrial-pipes", label: "Tuyaux industriels" },
      { href: "/products/specialized-equipment", label: "Équipements spécialisés" },
    ],
  },
  {
    label: "Formation",
    kicker: "Trois niveaux",
    children: [
      { href: "/training/basic", label: "Formation de base" },
      { href: "/training/advanced", label: "Formation avancée" },
      { href: "/training/specialized", label: "Formation spécialisée" },
    ],
  },
  {
    label: "Tarifs",
    kicker: "Par taille d'entreprise",
    children: [
      { href: "/pricing/small-business", label: "Petites entreprises" },
      { href: "/pricing/medium-business", label: "Entreprises moyennes" },
      { href: "/pricing/large-business", label: "Grandes entreprises" },
    ],
  },
  {
    label: "Entreprise",
    kicker: "À propos de MA-ERI",
    children: [
      { href: "/about/history", label: "Notre histoire" },
      { href: "/about/mission", label: "Notre mission" },
      { href: "/about/team", label: "Notre équipe" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

export default function Navbar({ className }: { className?: string }) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 border-b transition-colors duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-border"
          : "bg-background/0 border-transparent",
        className,
      )}
      onMouseLeave={() => setOpenMenu(null)}
    >
      <nav
        className="container mx-auto px-6 lg:px-10 h-16 md:h-20 flex items-center justify-between"
        aria-label="Navigation principale"
      >
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/logo.png"
            alt="MA-ERI Consulting"
            width={32}
            height={32}
            className="rounded"
            priority
          />
          <span className="font-display text-lg font-medium tracking-tight">
            MA-ERI
          </span>
        </Link>

        {/* Desktop menu */}
        <ul className="hidden lg:flex items-center gap-1 text-sm">
          {NAV.map((item) => {
            const isOpen = openMenu === item.label;
            if (item.children) {
              return (
                <li
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setOpenMenu(item.label)}
                  onFocus={() => setOpenMenu(item.label)}
                >
                  <button
                    type="button"
                    className={cn(
                      "px-4 py-2 rounded-full text-foreground/80 hover:text-foreground transition-colors",
                      isOpen && "text-foreground",
                    )}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                  >
                    {item.label}
                  </button>
                  {isOpen && (
                    <div
                      className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[min(38rem,92vw)]"
                    >
                      <div className="border border-border bg-background/95 backdrop-blur-xl shadow-xl p-6 rounded-md animate-fade-in">
                        {item.kicker && (
                          <p className="kicker kicker-brand mb-5">{item.kicker}</p>
                        )}
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                          {item.children.map((c) => (
                            <li key={c.href}>
                              <Link
                                href={c.href}
                                className="group flex flex-col gap-0.5 rounded-md px-3 py-3 hover:bg-secondary/60 transition-colors"
                                onClick={() => setOpenMenu(null)}
                              >
                                <span className="flex items-center justify-between gap-3 font-medium">
                                  {c.label}
                                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                </span>
                                {c.hint && (
                                  <span className="text-xs text-muted-foreground">
                                    {c.hint}
                                  </span>
                                )}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </li>
              );
            }
            return (
              <li key={item.label}>
                <Link
                  href={item.href!}
                  className="px-4 py-2 rounded-full text-foreground/80 hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden lg:flex items-center gap-3">
          <ModeToggle />
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-transform duration-300 hover:scale-[1.03]"
            style={{ backgroundColor: "var(--ink)", color: "var(--paper)" }}
          >
            Devis
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <button
          type="button"
          className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-full border border-border"
          aria-label={isMobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={isMobileOpen}
          onClick={() => setIsMobileOpen((o) => !o)}
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile sheet */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-background overflow-y-auto animate-fade-in">
          <div className="container mx-auto px-6 py-8 flex flex-col gap-8">
            {NAV.map((item) => (
              <section key={item.label} className="flex flex-col gap-4">
                <p className="kicker kicker-brand">{item.label}</p>
                {item.children ? (
                  <ul className="flex flex-col divide-y divide-border border-y border-border">
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link
                          href={c.href}
                          onClick={() => setIsMobileOpen(false)}
                          className="flex items-center justify-between py-4 text-lg font-medium"
                        >
                          {c.label}
                          <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Link
                    href={item.href!}
                    onClick={() => setIsMobileOpen(false)}
                    className="flex items-center justify-between py-4 text-lg font-medium border-y border-border"
                  >
                    Aller à {item.label}
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                )}
              </section>
            ))}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <ModeToggle />
              <Link
                href="/contact"
                onClick={() => setIsMobileOpen(false)}
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium"
                style={{ backgroundColor: "var(--ink)", color: "var(--paper)" }}
              >
                Demander un devis
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
