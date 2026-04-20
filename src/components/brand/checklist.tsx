import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function Checklist({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-col divide-y divide-border border-y border-border", className)}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-4 py-5">
          <span
            aria-hidden
            className="mt-1 flex h-5 w-5 flex-none items-center justify-center rounded-full"
            style={{ backgroundColor: "var(--brand)", color: "var(--brand-foreground)" }}
          >
            <Check className="h-3 w-3" strokeWidth={3} />
          </span>
          <span className="text-base md:text-lg leading-snug text-pretty">{item}</span>
        </li>
      ))}
    </ul>
  );
}
