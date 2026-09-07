import { Building2, Cable, Package } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStatsSkeleton } from "../skeletons/DashboardStatsSkeleton";

type DashboardStats = {
  providers: number;
  plans: number;
  coverage: number;
};

type DashboardStatsProps = {
  stats?: DashboardStats;
  isLoading: boolean;
};

export function DashboardStats({ stats, isLoading }: DashboardStatsProps) {
  const items = [
    {
      title: "Provedores",
      value: stats?.providers ?? 0,
      description: "provedores cadastrados",
      icon: Building2,
    },
    {
      title: "Planos",
      value: stats?.plans ?? 0,
      description: "planos cadastrados",
      icon: Package,
    },
    {
      title: "Coberturas",
      value: stats?.coverage ?? 0,
      description: "registros de cobertura",
      icon: Cable,
    },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {isLoading ? (
        <DashboardStatsSkeleton />
      ) : (
        items.map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{item.title}</CardTitle>

                <Icon className="size-5 text-muted-foreground" />
              </CardHeader>

              <CardContent>
                <div className="text-3xl font-bold">{item.value}</div>

                <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          );
        })
      )}
    </section>
  );
}
