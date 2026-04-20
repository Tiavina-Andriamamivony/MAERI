import * as React from "react";
import { cn } from "@/lib/utils";

export type Step = {
  title: string;
  description: string;
};

export function Steps({ steps, className }: { steps: Step[]; className?: string }) {
  return (
    <ol className={cn("grid grid-cols-1 md:grid-cols-4 gap-px bg-border border border-border", className)}>
      {steps.map((s, i) => (
        <li key={s.title} className="bg-background p-8 flex flex-col gap-5">
          <span
            className="font-display text-5xl md:text-6xl font-medium tabular-nums leading-none"
            style={{ color: "var(--brand)" }}
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="font-display text-xl font-medium leading-tight">{s.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
        </li>
      ))}
    </ol>
  );
}
