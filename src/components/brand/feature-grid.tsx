import * as React from "react";
import { cn } from "@/lib/utils";

export type Feature = {
  index?: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
};

export function FeatureGrid({
  features,
  columns = 3,
  className,
}: {
  features: Feature[];
  columns?: 2 | 3 | 4;
  className?: string;
}) {
  const colClass =
    columns === 2
      ? "md:grid-cols-2"
      : columns === 4
        ? "md:grid-cols-2 lg:grid-cols-4"
        : "md:grid-cols-2 lg:grid-cols-3";

  return (
    <ul className={cn("grid grid-cols-1 gap-px bg-border border border-border", colClass, className)}>
      {features.map((f, i) => (
        <li
          key={f.title}
          className="bg-background p-8 md:p-10 flex flex-col gap-4 group transition-colors hover:bg-secondary/50"
        >
          {(f.index || f.icon) && (
            <div className="flex items-center justify-between text-muted-foreground">
              {f.index && <span className="kicker tabular-nums">{f.index ?? String(i + 1).padStart(2, "0")}</span>}
              {f.icon && (
                <span className="text-brand/80 group-hover:text-brand transition-colors" aria-hidden>
                  {f.icon}
                </span>
              )}
            </div>
          )}
          <h3 className="font-display text-2xl md:text-3xl font-medium text-balance leading-tight">
            {f.title}
          </h3>
          <p className="text-muted-foreground leading-relaxed text-pretty">
            {f.description}
          </p>
        </li>
      ))}
    </ul>
  );
}
