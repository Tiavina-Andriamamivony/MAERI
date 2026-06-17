import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Package } from "lucide-react";

import { CTABlock, PageHero } from "@/components/brand";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getProductsByProductType } from "@/app/actions/productActions";
import { PRODUCT_TYPES, getProductTypeBySlug } from "@/lib/product-types";
import type { Product } from "@/app/generated/prisma/client";

type PageParams = { type: string };

/** Pré-génère une page statique par type connu. */
export function generateStaticParams(): PageParams[] {
  return PRODUCT_TYPES.map(({ slug }) => ({ type: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { type } = await params;
  const meta = getProductTypeBySlug(type);
  if (!meta) return { title: "Produits introuvables" };

  return {
    title: meta.title,
    description: meta.lede,
  };
}

export default async function ProductListPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { type } = await params;
  const meta = getProductTypeBySlug(type);
  if (!meta) notFound();

  const result = await getProductsByProductType(meta.type);
  const products = result.success ? result.data : [];

  return (
    <>
      <PageHero
        index="→"
        kicker={`Produits · ${meta.label}`}
        title={meta.title}
        lede={meta.lede}
        meta={[
          { label: "Catégorie", value: meta.label },
          { label: "Références", value: String(products.length) },
          { label: "Zone", value: "Madagascar" },
        ]}
      />

      <section className="container mx-auto px-6 lg:px-10 py-24 md:py-32">
        {products.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <CTABlock
        kicker="Un besoin précis ?"
        title={
          <>
            Envoyez-nous <span className="italic">votre bordereau.</span>
          </>
        }
        description="Nous chiffrons sous 24 heures et confirmons la disponibilité ligne par ligne."
        primary={{ href: "/contact", label: "Demander un devis" }}
        secondary={{ href: "/products/list/" + nextSlug(meta.slug), label: "Voir une autre catégorie" }}
      />
    </>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="h-full gap-0 overflow-hidden py-0 transition-colors hover:border-brand">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <Package className="h-10 w-10" aria-hidden />
          </div>
        )}
      </div>
      <CardHeader className="gap-2 py-6">
        <CardTitle className="font-display text-xl font-medium">
          {product.name}
        </CardTitle>
        {product.description && (
          <CardDescription className="line-clamp-3">
            {product.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="mt-auto pb-6">
        <Link
          href="/contact"
          className="kicker-brand brand-underline inline-block"
        >
          Demander un devis
        </Link>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-border bg-muted/30 px-6 py-20 text-center">
      <Package className="mx-auto h-10 w-10 text-muted-foreground" aria-hidden />
      <p className="mt-6 font-display text-2xl font-medium">
        Catalogue en cours de constitution
      </p>
      <p className="mx-auto mt-3 max-w-md text-muted-foreground">
        Aucun produit n’est encore référencé dans cette catégorie. Contactez-nous
        pour un sourcing sur mesure.
      </p>
      <Link
        href="/contact"
        className="kicker-brand brand-underline mt-8 inline-block"
      >
        Nous contacter
      </Link>
    </div>
  );
}

/** Slug de la catégorie suivante, pour proposer une navigation circulaire. */
function nextSlug(currentSlug: string): string {
  const index = PRODUCT_TYPES.findIndex((entry) => entry.slug === currentSlug);
  const next = PRODUCT_TYPES[(index + 1) % PRODUCT_TYPES.length];
  return next.slug;
}
