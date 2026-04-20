import * as React from "react";
import { cn } from "@/lib/utils";

export type StatItem = {
  value: string;
  label: string;
  suffix?: string;
};

export function StatBand({
  stats,
  className,
  caption,
}: {
  stats: StatItem[];
  caption?: string;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "border-y border-border bg-background",
        className,
      )}
    >
      <div className="container mx-auto px-6 lg:px-10 py-16 md:py-20">
        {caption && <p className="kicker kicker-brand mb-10">{caption}</p>}
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col gap-2">
              <dt className="flex items-baseline gap-1">
                <span className="font-display text-5xl md:text-6xl lg:text-7xl font-medium tabular-nums tracking-tight">
                  {s.value}
                </span>
                {s.suffix && (
                  <span className="font-display text-2xl md:text-3xl text-brand">
                    {s.suffix}
                  </span>
                )}
              </dt>
              <dd className="kicker">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
