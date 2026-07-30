"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import type { Article } from "@/app/generated/prisma/client";
import { rankByMargin, type ArticleMargin } from "@/lib/analyse/margin";
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
  margin: {
    label: "Marge brute",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

/** Taux affiché au survol, ou mention explicite quand il est incalculable. */
function formatMarginRate(rate: number | null): string {
  if (rate === null) return "taux indisponible (prix d'achat nul)";
  return `${rate.toLocaleString("fr-FR")} % du prix d'achat`;
}

/** Légende de la carte, incluant les articles écartés faute de prix complet. */
function describeRanking(shown: number, excludedCount: number): string {
  const lines = [
    `Les ${shown} plus fortes marges brutes.`,
    "Au survol : la part que la marge représente du prix d'achat.",
  ];

  if (excludedCount === 1) {
    lines.push("1 article sans prix complet n'a pas pu être classé.");
  } else if (excludedCount > 1) {
    lines.push(
      `${excludedCount} articles sans prix complet n'ont pas pu être classés.`,
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
                formatMarginRate(item.payload.marginRateOnCost)
              }
            />
          }
        />
        <Bar dataKey="margin" fill="var(--color-margin)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}

/**
 * Articles les plus rentables, classés par marge brute. Les données sont
 * dérivées de la liste fournie : modifier un prix (qui revalide
 * `/admin/analyses`) met le graphique à jour immédiatement.
 */
export default function ArticlesMarginChart({
  articles,
}: {
  articles: Article[];
}) {
  const { ranked, excludedCount } = rankByMargin(articles);
  const top = ranked.slice(0, TOP_COUNT);

  if (articles.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Articles les plus rentables</CardTitle>
        <CardDescription>
          {top.length === 0
            ? "Aucun article n'a ses deux prix renseignés : le classement par marge est indisponible."
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
