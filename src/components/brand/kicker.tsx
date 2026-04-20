import * as React from "react";
import { cn } from "@/lib/utils";

type KickerProps = React.HTMLAttributes<HTMLSpanElement> & {
  index?: string;
  accent?: boolean;
};

/**
 * Editorial kicker label — monospace, tracked uppercase text used as a
 * section tag. Optionally prefixed with a two-digit number like "01 —".
 */
export function Kicker({
  index,
  accent,
  className,
  children,
  ...props
}: KickerProps) {
  return (
    <span
      className={cn("kicker inline-flex items-center gap-3", accent && "kicker-brand", className)}
      {...props}
    >
      {index && (
        <>
          <span aria-hidden className="tabular-nums">{index}</span>
          <span aria-hidden className="inline-block h-px w-8 bg-current opacity-40" />
        </>
      )}
      <span>{children}</span>
    </span>
  );
}
