import * as React from "react";
import Image from "next/image";

/**
 * Brand Seal — the logo as frontispiece.
 *
 * A dedicated section that treats the MA-ERI mark as an engraved seal:
 * triple concentric rings, four cardinal tick marks, roman-numeral pillars
 * and a Latin-style motto. Sits between the hero and the stat band.
 */
export function BrandSeal() {
  return (
    <section
      aria-label="Sceau MA-ERI Consulting"
      className="relative overflow-hidden border-b border-border bg-background"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-60 bg-grain pointer-events-none"
      />

      {/* ember halo exactly behind the seal */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[40rem] w-[40rem] rounded-full pointer-events-none opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, var(--brand), transparent 70%)",
        }}
      />

      {/* hairline rule, full-width, top */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-border"
      />

      <div className="relative container mx-auto px-6 lg:px-10 py-24 md:py-36">
        {/* coordinates strip — reinforces the "official document" feel */}
        <div
          className="flex items-center justify-between text-xs md:text-sm animate-fade-in"
          style={{ animationDelay: "80ms" }}
        >
          <span className="kicker">— 18°09′S / 49°24′E</span>
          <span className="kicker hidden sm:inline">Toamasina · MG</span>
          <span className="kicker">Éd. MMXXIV</span>
        </div>

        {/* the seal */}
        <div className="mt-14 md:mt-20 flex flex-col items-center">
          <div
            className="relative flex items-center justify-center animate-rise"
            style={{ animationDelay: "180ms" }}
          >
            {/* outer ring */}
            <div
              aria-hidden
              className="absolute h-[22rem] w-[22rem] md:h-[32rem] md:w-[32rem] rounded-full border border-border"
            />
            {/* middle ring — brand-tinted, very faint */}
            <div
              aria-hidden
              className="absolute h-[19rem] w-[19rem] md:h-[27rem] md:w-[27rem] rounded-full border"
              style={{ borderColor: "color-mix(in oklch, var(--brand) 35%, transparent)" }}
            />
            {/* inner ring */}
            <div
              aria-hidden
              className="absolute h-[16rem] w-[16rem] md:h-[22rem] md:w-[22rem] rounded-full border border-border/70"
            />

            {/* cardinal ticks */}
            <span
              aria-hidden
              className="absolute -top-2 md:-top-3 left-1/2 -translate-x-1/2 h-4 md:h-6 w-px bg-foreground/80"
            />
            <span
              aria-hidden
              className="absolute -bottom-2 md:-bottom-3 left-1/2 -translate-x-1/2 h-4 md:h-6 w-px bg-foreground/80"
            />
            <span
              aria-hidden
              className="absolute top-1/2 -left-2 md:-left-3 -translate-y-1/2 w-4 md:w-6 h-px bg-foreground/80"
            />
            <span
              aria-hidden
              className="absolute top-1/2 -right-2 md:-right-3 -translate-y-1/2 w-4 md:w-6 h-px bg-foreground/80"
            />

            {/* the mark itself */}
            <Image
              src="/logo.png"
              alt="MA-ERI Consulting"
              width={640}
              height={640}
              priority
              className="relative h-48 w-48 md:h-72 md:w-72 object-contain drop-shadow-[0_12px_30px_rgba(0,0,0,0.18)]"
            />
          </div>

          {/* wordmark */}
          <h2
            className="mt-12 md:mt-16 font-display text-display-md font-medium tracking-tight text-center animate-rise"
            style={{ animationDelay: "320ms" }}
          >
            MA-ERI <span className="italic text-muted-foreground">Consulting</span>
          </h2>

          {/* motto */}
          <p
            className="mt-5 max-w-xl text-center font-display text-lg md:text-xl italic text-muted-foreground leading-snug animate-fade-in"
            style={{ animationDelay: "460ms" }}
          >
            « Partenaire de confiance — la matière, le savoir, le digital, sous
            un seul toit. »
          </p>

          {/* three-pillar epigraph, roman numerals */}
          <dl
            className="mt-14 md:mt-20 w-full max-w-3xl grid grid-cols-3 border-t border-border animate-fade-in"
            style={{ animationDelay: "600ms" }}
          >
            {[
              { r: "I", t: "La matière" },
              { r: "II", t: "Le savoir" },
              { r: "III", t: "Le digital" },
            ].map((p, i) => (
              <div
                key={p.r}
                className={
                  "flex flex-col items-center gap-2 pt-6 pb-2 " +
                  (i < 2 ? "border-r border-border" : "")
                }
              >
                <dt
                  className="font-display text-2xl md:text-3xl font-medium"
                  style={{ color: "var(--brand)" }}
                >
                  {p.r}
                </dt>
                <dd className="kicker">{p.t}</dd>
              </div>
            ))}
          </dl>

          {/* founder signature line — subtle, closes the document */}
          <div
            className="mt-16 md:mt-20 flex items-center gap-4 text-xs animate-fade-in"
            style={{ animationDelay: "740ms" }}
          >
            <span className="h-px w-10 bg-border" />
            <span className="kicker">Fondée MMXXIV · Toamasina, Madagascar</span>
            <span className="h-px w-10 bg-border" />
          </div>
        </div>
      </div>
    </section>
  );
}
