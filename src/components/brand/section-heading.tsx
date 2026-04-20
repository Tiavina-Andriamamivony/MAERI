import * as React from "react";
import { cn } from "@/lib/utils";
import { Kicker } from "./kicker";

type SectionHeadingProps = {
  index?: string;
  kicker?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  index,
  kicker,
  title,
  lede,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-6 max-w-3xl",
        align === "center" && "mx-auto text-center items-center",
        className,
      )}
    >
      {(kicker || index) && <Kicker index={index}>{kicker}</Kicker>}
      <h2 className="display font-display text-display-md font-medium text-balance">
        {title}
      </h2>
      {lede && (
        <p className="text-lg md:text-xl text-muted-foreground text-pretty leading-relaxed max-w-2xl">
          {lede}
        </p>
      )}
    </header>
  );
}
