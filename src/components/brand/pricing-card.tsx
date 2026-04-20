import * as React from "react";
import Link from "next/link";
import { Check, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type PricingTier = {
  name: string;
  kicker?: string;
  lede: string;
  price: string;
  priceSuffix?: string;
  priceFootnote?: string;
  highlight?: boolean;
  features: string[];
  cta: { href: string; label: string };
};

export function PricingCard({ tier, className }: { tier: PricingTier; className?: string }) {
  return (
    <article
      className={cn(
        "group relative flex flex-col border border-border bg-background p-8 md:p-10",
        tier.highlight && "bg-ink text-paper border-transparent",
        className,
      )}
      style={
        tier.highlight
          ? { backgroundColor: "var(--ink)", color: "var(--paper)" }
          : undefined
      }
    >
      {tier.kicker && (
        <span
          className={cn(
            "kicker mb-8",
            tier.highlight ? "text-paper/60" : undefined,
          )}
          style={tier.highlight ? { color: "var(--brand)" } : undefined}
        >
          {tier.kicker}
        </span>
      )}

      <h3 className="font-display text-3xl md:text-4xl font-medium leading-tight">
        {tier.name}
      </h3>

      <p
        className={cn(
          "mt-4 text-sm leading-relaxed",
          tier.highlight ? "text-paper/70" : "text-muted-foreground",
        )}
      >
        {tier.lede}
      </p>

      <div className="mt-10 flex items-baseline gap-2">
        <span className="font-display text-5xl md:text-6xl font-medium tracking-tight">
          {tier.price}
        </span>
        {tier.priceSuffix && (
          <span
            className={cn(
              "text-sm",
              tier.highlight ? "text-paper/60" : "text-muted-foreground",
            )}
          >
            {tier.priceSuffix}
          </span>
        )}
      </div>
      {tier.priceFootnote && (
        <p
          className={cn(
            "mt-2 text-xs",
            tier.highlight ? "text-paper/50" : "text-muted-foreground",
          )}
        >
          {tier.priceFootnote}
        </p>
      )}

      <ul className="mt-10 flex flex-col gap-3 text-sm">
        {tier.features.map((f) => (
          <li key={f} className="flex items-start gap-3">
            <Check
              className="h-4 w-4 mt-0.5 flex-none"
              style={{ color: "var(--brand)" }}
              aria-hidden
            />
            <span
              className={tier.highlight ? "text-paper/85" : undefined}
            >
              {f}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-10 pt-8 border-t border-current/10">
        <Link
          href={tier.cta.href}
          className={cn(
            "group/cta inline-flex items-center justify-between w-full gap-6 rounded-full px-6 py-3 text-sm font-medium transition-transform duration-300 hover:scale-[1.01]",
            tier.highlight
              ? "bg-paper text-ink"
              : "bg-ink text-paper",
          )}
          style={
            tier.highlight
              ? { backgroundColor: "var(--paper)", color: "var(--ink)" }
              : { backgroundColor: "var(--ink)", color: "var(--paper)" }
          }
        >
          <span>{tier.cta.label}</span>
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1 group-hover/cta:-translate-y-1" />
        </Link>
      </div>
    </article>
  );
}
