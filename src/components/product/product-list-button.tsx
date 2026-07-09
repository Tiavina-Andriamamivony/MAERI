import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { productListPath } from "@/lib/product-types";
import type { Product_type } from "@/app/generated/prisma/enums";

type ProductListButtonProps = {
  type: Product_type;
  label?: string;
  className?: string;
};

// Redirige vers la liste publique d'un type de produit (`/products/list/<slug>`).
export function ProductListButton({
  type,
  label = "Voir tous les produits",
  className,
}: ProductListButtonProps) {
  return (
    <Link
      href={productListPath(type)}
      className={cn(
        "group inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-sm font-medium text-primary-foreground transition-transform duration-300 hover:scale-[1.02]",
        className,
      )}
    >
      <span>{label}</span>
      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
    </Link>
  );
}
