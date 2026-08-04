"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import type { Article } from "@/app/generated/prisma/client";
import { rankByMarginRate, type ArticleMargin } from "@/lib/analyse/margin";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

/** Nombre d'articles affichés : au-delà, les libellés deviennent illisibles. */
const TOP_COUNT = 10;

const chartConfig = {
  marginRateOnCost: {
    label: "Taux de marge",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

/**
 * Détail affiché au survol : la barre porte un pourcentage, on rappelle donc
 * la marge en ariary qu'il représente.
 */
function formatMarginDetail(entry: ArticleMargin): string {
  const rate = entry.marginRateOnCost.toLocaleString("fr-FR");
  const margin = entry.margin.toLocaleString("fr-FR");

  return `${rate} % du prix d'achat — ${margin} Ar de marge brute`;
}

/** Légende de la carte, incluant les articles qu'on n'a pas pu classer. */
function describeRanking(shown: number, excludedCount: number): string {
  const lines = [
    `Les ${shown} plus forts taux de marge : la marge rapportée au prix d'achat.`,
    "Au survol : la marge brute en ariary correspondante.",
  ];

  if (excludedCount === 1) {
    lines.push("1 article sans prix d'achat exploitable n'a pas pu être classé.");
  } else if (excludedCount > 1) {
    lines.push(
      `${excludedCount} articles sans prix d'achat exploitable n'ont pas pu être classés.`,
    );
  }

  return lines.join(" ");
}

/**
 * Barres recharts isolées de la carte : garde l'arbre JSX peu profond (les
 * enfants du `BarChart` doivent rester enfants directs du `ChartContainer`
 * pour être dimensionnés par le `ResponsiveContainer`).
 */
function MarginBars({ data }: { data: ArticleMargin[] }) {
  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
      <BarChart accessibilityLayer data={data} margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="designation"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(_value, _name, item) =>
                formatMarginDetail(item.payload)
              }
            />
          }
        />
        <Bar
          dataKey="marginRateOnCost"
          fill="var(--color-marginRateOnCost)"
          radius={4}
        />
      </BarChart>
    </ChartContainer>
  );
}

/**
 * Articles les plus rentables, classés par taux de marge. Les données sont
 * dérivées de la liste fournie : modifier un prix (qui revalide
 * `/admin/analyses`) met le graphique à jour immédiatement.
 */
export default function ArticlesMarginChart({
  articles,
}: {
  articles: Article[];
}) {
  const { ranked, excludedCount } = rankByMarginRate(articles);
  const top = ranked.slice(0, TOP_COUNT);

  if (articles.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Articles les plus rentables</CardTitle>
        <CardDescription>
          {top.length === 0
            ? "Aucun article n'a un prix d'achat et un prix de vente exploitables : le classement par taux de marge est indisponible."
            : describeRanking(top.length, excludedCount)}
        </CardDescription>
      </CardHeader>
      {top.length > 0 && (
        <CardContent>
          <MarginBars data={top} />
        </CardContent>
      )}
    </Card>
  );
}
