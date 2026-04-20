import * as React from "react";
import { cn } from "@/lib/utils";
import { Kicker } from "./kicker";

type PageHeroProps = {
  index?: string;
  kicker?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  meta?: { label: string; value: React.ReactNode }[];
  className?: string;
};

/**
 * Standard editorial page hero used by every inner page.
 * Left-aligned, generous top space, numbered kicker, big serif headline,
 * optional metadata row at the bottom.
 */
export function PageHero({
  index,
  kicker,
  title,
  lede,
  meta,
  className,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative border-b border-border bg-background bg-grain",
        className,
      )}
    >
      <div className="container mx-auto px-6 lg:px-10 py-20 md:py-28 lg:py-36">
        {(kicker || index) && (
          <div className="animate-kicker mb-10">
            <Kicker index={index} accent>
              {kicker}
            </Kicker>
          </div>
        )}

        <h1 className="display font-display text-display-lg font-medium text-balance max-w-[16ch] animate-rise">
          {title}
        </h1>

        {lede && (
          <p
            className="mt-10 max-w-2xl text-xl md:text-2xl text-muted-foreground leading-snug text-pretty animate-rise"
            style={{ animationDelay: "120ms" }}
          >
            {lede}
          </p>
        )}

        {meta && meta.length > 0 && (
          <dl
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 border-t border-border pt-8 max-w-3xl animate-rise"
            style={{ animationDelay: "240ms" }}
          >
            {meta.map((item) => (
              <div key={item.label} className="flex flex-col gap-1">
                <dt className="kicker">{item.label}</dt>
                <dd className="font-display text-2xl md:text-3xl font-medium">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
