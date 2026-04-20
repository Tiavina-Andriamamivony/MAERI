import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Kicker } from "./kicker";

const columns: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Services",
    links: [
      { href: "/services/approvisionnement", label: "Approvisionnement industriel" },
      { href: "/services/raw-material-supply", label: "Matières premières" },
      { href: "/services/supplier-networking", label: "Réseau fournisseurs" },
      { href: "/services/professional-training", label: "Formation professionnelle" },
      { href: "/services/conseil-informatique", label: "Conseil informatique" },
    ],
  },
  {
    title: "Produits",
    links: [
      { href: "/products/construction-materials", label: "Matériaux de construction" },
      { href: "/products/industrial-pipes", label: "Tuyaux industriels" },
      { href: "/products/specialized-equipment", label: "Équipements spécialisés" },
    ],
  },
  {
    title: "Formation",
    links: [
      { href: "/training/basic", label: "Formation de base" },
      { href: "/training/advanced", label: "Formation avancée" },
      { href: "/training/specialized", label: "Formation spécialisée" },
    ],
  },
  {
    title: "Entreprise",
    links: [
      { href: "/about/history", label: "Notre histoire" },
      { href: "/about/mission", label: "Notre mission" },
      { href: "/about/team", label: "Notre équipe" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-6 lg:px-10 py-20">
        {/* Editorial motto */}
        <div className="max-w-4xl">
          <Kicker accent>Depuis Toamasina, pour l'océan Indien</Kicker>
          <p className="mt-6 font-display text-display-md font-medium text-balance leading-[1.05]">
            Matière, savoir, digital.
            <br />
            <span className="text-muted-foreground">
              Les trois leviers qui font tenir une entreprise.
            </span>
          </p>
        </div>

        <span className="rule my-16 text-foreground" />

        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="MA-ERI Consulting"
                width={56}
                height={56}
                className="rounded h-14 w-14"
              />
              <span className="font-display text-lg font-medium leading-none">
                MA-ERI{' '}
                <span className="text-muted-foreground">Consulting</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Startup malgache. Approvisionnement, formation, conseil IT pour les
              entreprises qui produisent.
            </p>
          </div>

          {columns.map((col) => (
            <nav key={col.title} className="flex flex-col gap-4" aria-label={col.title}>
              <p className="kicker">{col.title}</p>
              <ul className="flex flex-col gap-3 text-sm">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-foreground/80 hover:text-foreground transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <span className="rule my-12 text-foreground" />

        <div className="flex flex-col md:flex-row justify-between gap-6 text-xs text-muted-foreground">
          <div className="flex flex-col md:flex-row gap-4 md:gap-10">
            <span>© {year} MA-ERI Consulting</span>
            <span>501 Toamasina, Madagascar</span>
            <a href="mailto:contact-maeri@telma.net" className="hover:text-foreground transition-colors">
              contact-maeri@telma.net
            </a>
            <a href="mailto:info-maeri@telma.net" className="hover:text-foreground transition-colors">
              info-maeri@telma.net
            </a>
          </div>
          <span className="kicker">Fait à Madagascar — (MG) 🇲🇬</span>
        </div>
      </div>
    </footer>
  );
}
