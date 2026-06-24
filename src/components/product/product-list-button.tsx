import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { productListPath } from "@/lib/product-types";
import type { Product_type } from "@/app/generated/prisma/enums";

type ProductListButtonProps = {
  /** Type de produit dont on veut afficher la liste. */
  type: Product_type;
  /** Libellé du bouton. */
  label?: string;
  className?: string;
};

/**
 * Bouton de redirection vers la liste des produits d'un type donné
 * (`/products/list/<slug>`). Posé sous le PageHero des pages produits.
 */
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
