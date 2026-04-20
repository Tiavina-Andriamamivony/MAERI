import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Kicker } from "./kicker";

/**
 * Editorial home hero — oversized Fraunces headline, asymmetric layout,
 * a vertical brand bar on the right that holds the live year and a thin
 * product still life.
 */
export function HomeHero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      <div
        aria-hidden
        className="absolute inset-0 opacity-70 bg-grain pointer-events-none"
      />

      {/* Soft ember glow bottom-left */}
      <div
        aria-hidden
        className="absolute -bottom-40 -left-20 h-[36rem] w-[36rem] rounded-full pointer-events-none opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, var(--brand), transparent 70%)",
        }}
      />

      <div className="container mx-auto px-6 lg:px-10 pt-16 md:pt-24 pb-20 md:pb-32 relative">
        {/* top meta row */}
        <div className="flex items-center justify-between text-xs md:text-sm">
          <Kicker accent>MA-ERI Consulting / 01</Kicker>
          <span className="kicker hidden md:inline">
            Édition {new Date().getFullYear()} — Toamasina, Madagascar
          </span>
        </div>

        <div className="mt-12 md:mt-20 grid grid-cols-12 gap-6 lg:gap-10">
          {/* left: headline + lede + CTA */}
          <div className="col-span-12 lg:col-span-8">
            <h1 className="display font-display font-medium text-display-xl text-balance animate-rise leading-[0.92]">
              La matière,
              <br />
              <span className="italic text-muted-foreground">le savoir,</span>
              <br />
              le digital.
            </h1>

            <p
              className="mt-10 max-w-xl text-lg md:text-xl text-muted-foreground leading-relaxed animate-rise"
              style={{ animationDelay: "160ms" }}
            >
              MA-ERI Consulting accompagne les entreprises malgaches et de
              l'océan Indien. Nous fournissons les matières premières, formons
              vos équipes et construisons vos outils numériques — pour que vous
              produisiez mieux, plus vite, avec moins de friction.
            </p>

            <div
              className="mt-12 flex flex-col sm:flex-row gap-4 animate-rise"
              style={{ animationDelay: "320ms" }}
            >
              <Link
                href="/contact"
                className="group inline-flex items-center justify-between gap-8 rounded-full px-8 py-4 text-sm font-medium transition-transform duration-300 hover:scale-[1.02]"
                style={{
                  backgroundColor: "var(--ink)",
                  color: "var(--paper)",
                }}
              >
                <span>Demander un devis</span>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
              <Link
                href="/services"
                className="group inline-flex items-center gap-3 rounded-full border border-border px-8 py-4 text-sm font-medium hover:border-foreground/60 transition-colors"
              >
                Découvrir nos services
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </div>
          </div>

          {/* right: vertical brand slab */}
          <aside
            className="col-span-12 lg:col-span-4 lg:pl-8 animate-fade-in"
            style={{ animationDelay: "420ms" }}
          >
            <div className="relative h-full flex flex-col justify-between border-l border-border pl-6 lg:pl-8 min-h-[320px]">
              <div className="flex flex-col gap-4">
                <Image
                  src="/logo.png"
                  alt="MA-ERI Consulting"
                  width={240}
                  height={246}
                  className="rounded h-32 w-32 md:h-44 md:w-44 object-contain"
                />
                <p className="font-display text-xl font-medium leading-snug text-pretty">
                  Un partenaire industriel, pédagogique et numérique, sous un
                  seul toit.
                </p>
              </div>

              <dl className="grid grid-cols-2 gap-6 mt-10 pt-8 border-t border-border">
                <div>
                  <dt className="kicker">Fondée</dt>
                  <dd className="font-display text-3xl font-medium mt-1">2024</dd>
                </div>
                <div>
                  <dt className="kicker">Pôles</dt>
                  <dd className="font-display text-3xl font-medium mt-1">04</dd>
                </div>
                <div>
                  <dt className="kicker">Siège</dt>
                  <dd className="font-display text-lg font-medium mt-1">
                    Toamasina
                  </dd>
                </div>
                <div>
                  <dt className="kicker">Portée</dt>
                  <dd className="font-display text-lg font-medium mt-1">
                    Océan Indien
                  </dd>
                </div>
              </dl>

              <a
                href="mailto:info-maeri@telma.net"
                className="mt-10 pt-6 border-t border-border group inline-flex items-center justify-between gap-3 text-sm font-medium hover:text-brand transition-colors"
              >
                <span className="kicker">Écrivez-nous</span>
                <span className="font-mono tabular-nums text-foreground group-hover:text-brand transition-colors">
                  info-maeri@telma.net
                </span>
              </a>
            </div>
          </aside>
        </div>

        {/* bottom marquee line of keywords */}
        <div
          className="mt-20 md:mt-28 border-t border-border pt-8 overflow-hidden animate-fade-in"
          style={{ animationDelay: "560ms" }}
        >
          <div className="flex gap-16 whitespace-nowrap animate-marquee will-change-transform kicker">
            {Array.from({ length: 2 }).flatMap((_, i) => [
              <span key={`a-${i}`}>— Roulements industriels</span>,
              <span key={`b-${i}`}>— Tuyaux &amp; vannes</span>,
              <span key={`c-${i}`}>— Sourcing international</span>,
              <span key={`d-${i}`}>— Formation vente</span>,
              <span key={`e-${i}`}>— Gestion de stock</span>,
              <span key={`f-${i}`}>— UI / UX &amp; Data</span>,
              <span key={`g-${i}`}>— Microservices</span>,
              <span key={`h-${i}`}>— Hôtesses commerciales</span>,
            ])}
          </div>
        </div>
      </div>
    </section>
  );
}
