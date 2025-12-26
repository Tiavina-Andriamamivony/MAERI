
import { cn } from "@/lib/utils";
import { InteractiveGridPattern } from "./magicui/interactive-grid-pattern";
import { TextAnimate } from "./magicui/text-animate";
import { Button } from "./ui/button";
import { WordRotateDemo } from "./word-rotate";
import Link from "next/link";
import { AuroraText } from "./magicui/aurora-text";
import Image from "next/image";

// Remove any unused shadowColor variable if it exists in your code
export function InteractiveGridPatternDemo() {



  return (
    <div className="relative flex h-screen w-full box-border flex-col items-center justify-center overflow-hidden rounded-lg bg-background">
      <InteractiveGridPattern
        className={cn(
          "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
        )}
        
      />
        <Image
            src="/logo_bg.png"
            alt="MA-ERI Logo"
            width={200}
            height={200}
            className="mx-auto mb-8 mt-24"
          />
      <h1 className="text-4xl font-bold tracking-tighter md:text-4xl lg:text-5xl text-center m-2">
      Welcome to <AuroraText>MA-ERI Consulting</AuroraText>
    </h1>
    <br />

          <TextAnimate animation="blurInUp" by="character" once className=" md:text-4xl font-bold text-center m-2">
          Empowering Businesses with Premium Materials & Expertise.
    </TextAnimate>
    <br />
    <WordRotateDemo></WordRotateDemo>
    <br />
    
  <Button className="mt-4">
<Link href="/services" className="z-50 cursor-pointer">
    Explore Our Services
      </Link>
</Button>
    </div>
  );
}
