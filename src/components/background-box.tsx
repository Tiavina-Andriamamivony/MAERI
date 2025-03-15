"use client";

import { cn } from "@/lib/utils";
import { InteractiveGridPattern } from "./magicui/interactive-grid-pattern";
import { TextAnimate } from "./magicui/text-animate";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { WordRotateDemo } from "./word-rotate";
import Link from "next/link";
import { AuroraText } from "./magicui/aurora-text";

export function InteractiveGridPatternDemo() {

    const theme = useTheme();
    const shadowColor = theme.resolvedTheme === "dark" ? "white" : "black";


  return (
    <div className="relative flex h-screen w-screen box-border flex-col items-center justify-center overflow-hidden rounded-lg border bg-background">
      <InteractiveGridPattern
        className={cn(
          "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
        )}
        
      />
      <h1 className="text-4xl font-bold tracking-tighter md:text-5xl lg:text-7xl">
      Welcom to <AuroraText>MAERI Consulting</AuroraText>
    </h1>
    <br />

          <TextAnimate animation="blurInUp" by="character" once className="text-4xl font-bold text-center ">
          Empowering Businesses with Premium Materials & Expertise.
    </TextAnimate>
    <br />
    <WordRotateDemo></WordRotateDemo>
    <br />
    <Link href="/services" className="z-50">
        <Button className="mt-4">Explore Our Services</Button>
      </Link>

    </div>
  );
}
