import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Kicker } from "./kicker";

type CTABlockProps = {
  kicker?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
  className?: string;
};

export function CTABlock({
  kicker,
  title,
  description,
  primary,
  secondary,
  className,
}: CTABlockProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-y border-border bg-ink text-paper",
        className,
      )}
      style={{ backgroundColor: "var(--ink)", color: "var(--paper)" }}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 80% 20%, var(--brand) 0, transparent 55%)",
        }}
      />

      <div className="container mx-auto px-6 lg:px-10 py-24 md:py-32 relative">
        {kicker && (
          <Kicker accent className="mb-8" >
            {kicker}
          </Kicker>
        )}
        <h2 className="display font-display text-display-md font-medium max-w-[18ch] text-balance">
          {title}
        </h2>
        {description && (
          <p className="mt-8 max-w-2xl text-lg md:text-xl text-paper/70 leading-relaxed">
            {description}
          </p>
        )}

        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <Link
            href={primary.href}
            className="group inline-flex items-center justify-between gap-6 rounded-full bg-paper text-ink px-8 py-4 text-sm font-medium transition-transform duration-300 hover:scale-[1.02]"
            style={{ backgroundColor: "var(--paper)", color: "var(--ink)" }}
          >
            <span>{primary.label}</span>
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>

          {secondary && (
            <Link
              href={secondary.href}
              className="group inline-flex items-center gap-3 rounded-full border border-paper/25 px-8 py-4 text-sm font-medium text-paper/90 hover:border-paper/50 hover:text-paper transition-colors"
            >
              <span>{secondary.label}</span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
