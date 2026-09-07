import { Building2, Cable, MapPin } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CoverageSummarySkeleton } from "../skeletons/CoverageSummarySkeleton";

type CoverageSummaryData = {
  records: number;
  neighborhoods: number;
  providers: number;
};

type CoverageSummaryProps = {
  summary?: CoverageSummaryData;
  isLoading: boolean;
};

export function CoverageSummary({ summary, isLoading }: CoverageSummaryProps) {
  const items = [
    {
      title: "Registros de cobertura",
      value: summary?.records ?? 0,
      description: "registros cadastrados",
      icon: Cable,
    },
    {
      title: "Bairros cobertos",
      value: summary?.neighborhoods ?? 0,
      description: "bairros com cobertura",
      icon: MapPin,
    },
    {
      title: "Provedores com cobertura",
      value: summary?.providers ?? 0,
      description: "provedores atendendo bairros",
      icon: Building2,
    },
  ];

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Resumo de cobertura</h2>

        <p className="text-sm text-muted-foreground">
          Visão geral da cobertura cadastrada na plataforma.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {isLoading ? (
          <CoverageSummarySkeleton />
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
      </div>
    </section>
  );
}
