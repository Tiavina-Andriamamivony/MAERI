"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll for translucent header background
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile sheet is open
  useEffect(() => {
    if (!isMobileOpen) return;
    const { style } = document.body;
    const prev = style.overflow;
    style.overflow = "hidden";
    return () => {
      style.overflow = prev;
    };
  }, [isMobileOpen]);

  // Auto-close mobile sheet on route change
  useEffect(() => {
    setIsMobileOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  // Close on Escape
  useEffect(() => {
    if (!isMobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMobileOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 border-b transition-colors duration-300",
          scrolled || isMobileOpen
            ? "bg-background/95 backdrop-blur-xl border-border"
            : "bg-background/0 border-transparent",
          className,
        )}
      >
        <nav
          className="container mx-auto px-6 lg:px-10 h-16 md:h-20 flex items-center justify-between gap-4"
          aria-label="Navigation principale"
        >
          <Link
            href="/"
            className="flex items-center gap-3 shrink-0"
            onClick={() => setIsMobileOpen(false)}
          >
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

          {/* Desktop menu — hover/focus driven, scoped mouseleave */}
          <ul
            className="hidden lg:flex items-center gap-1 text-sm"
            onMouseLeave={() => setOpenMenu(null)}
          >
            {NAV.map((item) => {
              const isOpen = openMenu === item.label;
              if (item.children) {
                return (
                  <li
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setOpenMenu(item.label)}
                  >
                    <button
                      type="button"
                      className={cn(
                        "px-4 py-2 rounded-full text-foreground/80 hover:text-foreground transition-colors",
                        isOpen && "text-foreground",
                      )}
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      onFocus={() => setOpenMenu(item.label)}
                      onClick={() =>
                        setOpenMenu((curr) => (curr === item.label ? null : item.label))
                      }
                    >
                      {item.label}
                    </button>
                    {isOpen && (
                      <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[min(38rem,92vw)]">
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

          <div className="hidden lg:flex items-center gap-3 shrink-0">
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

          {/* Burger — mobile only */}
          <button
            type="button"
            onClick={() => setIsMobileOpen((o) => !o)}
            aria-label={isMobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isMobileOpen}
            aria-controls="mobile-nav-sheet"
            className={cn(
              "lg:hidden relative z-[60] inline-flex items-center justify-center h-11 w-11 rounded-full border transition-colors",
              isMobileOpen
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-background/60 text-foreground hover:border-foreground/60",
            )}
          >
            <span className="sr-only">
              {isMobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            </span>
            {isMobileOpen ? <X className="h-5 w-5" aria-hidden /> : <MenuIcon className="h-5 w-5" aria-hidden />}
          </button>
        </nav>
      </header>

      {/* Mobile sheet — rendered OUTSIDE the header to avoid any stacking/overflow surprise */}
      <div
        id="mobile-nav-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Menu principal"
        aria-hidden={!isMobileOpen}
        className={cn(
          "lg:hidden fixed inset-0 z-40 bg-background overflow-y-auto transition-[opacity,transform] duration-300 ease-out",
          isMobileOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none",
        )}
      >
        <div className="h-16 md:h-20" aria-hidden />
        <div className="container mx-auto px-6 pb-10 pt-6 flex flex-col gap-8">
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
                        className="flex items-center justify-between gap-4 py-4 text-lg font-medium active:opacity-60 transition-opacity"
                      >
                        <span className="flex-1">{c.label}</span>
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <Link
                  href={item.href!}
                  onClick={() => setIsMobileOpen(false)}
                  className="flex items-center justify-between gap-4 py-4 text-lg font-medium border-y border-border active:opacity-60 transition-opacity"
                >
                  <span className="flex-1">Aller à {item.label}</span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden />
                </Link>
              )}
            </section>
          ))}

          <div className="flex items-center justify-between gap-4 pt-4 border-t border-border">
            <ModeToggle />
            <Link
              href="/contact"
              onClick={() => setIsMobileOpen(false)}
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium"
              style={{ backgroundColor: "var(--ink)", color: "var(--paper)" }}
            >
              Demander un devis
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
