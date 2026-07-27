"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import type { Client } from "@/app/generated/prisma/client";
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

const chartConfig = {
  count: {
    label: "Clients",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type ProvinceCount = { province: string; count: number };

/** Regroupe les clients par province, du plus fourni au moins fourni. */
function countByProvince(clients: Client[]): ProvinceCount[] {
  const counts = new Map<string, number>();
  for (const { province } of clients) {
    counts.set(province, (counts.get(province) ?? 0) + 1);
  }
  return Array.from(counts, ([province, count]) => ({ province, count })).sort(
    (a, b) => b.count - a.count,
  );
}

/**
 * Barres recharts isolées de la carte : garde l'arbre JSX peu profond (les
 * enfants du `BarChart` doivent rester enfants directs du `ChartContainer`
 * pour être dimensionnés par le `ResponsiveContainer`).
 */
function ProvinceBars({ data }: { data: ProvinceCount[] }) {
  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
      <BarChart accessibilityLayer data={data} margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="province" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="count" fill="var(--color-count)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}

/**
 * Répartition des clients par province. Les données sont dérivées de la liste
 * fournie : ajouter ou supprimer un client (qui revalide `/admin/analyses`)
 * met le graphique à jour immédiatement.
 */
export default function ClientsProvinceChart({ clients }: { clients: Client[] }) {
  const data = countByProvince(clients);

  if (data.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clients par province</CardTitle>
        <CardDescription>
          Répartition des {clients.length} clients par province.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ProvinceBars data={data} />
      </CardContent>
    </Card>
  );
}
