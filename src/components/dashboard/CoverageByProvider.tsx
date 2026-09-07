import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CoverageByProviderSkeleton } from "../skeletons/CoverageByProviderSkeleton";

type CoverageByProviderData = {
  providerId: string;
  providerName: string;
  neighborhoods: number;
  records: number;
};

type CoverageByProviderProps = {
  providers?: CoverageByProviderData[];
  isLoading: boolean;
};

function EmptyState() {
  return (
    <div className="flex min-h-32 items-center justify-center px-6 py-8 text-center">
      <p className="text-sm text-muted-foreground">
        Nenhum registro de cobertura foi cadastrado ainda.
      </p>
    </div>
  );
}

export function CoverageByProvider({ providers, isLoading }: CoverageByProviderProps) {
  const maxNeighborhoods = Math.max(
    ...(providers?.map((provider) => provider.neighborhoods) ?? [0])
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cobertura por provedor</CardTitle>

        <p className="text-sm text-muted-foreground">
          Quantidade de bairros atendidos por cada provedor.
        </p>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <CoverageByProviderSkeleton />
        ) : providers?.length ? (
          <div className="space-y-5">
            {providers.map((provider) => {
              const percentage =
                maxNeighborhoods > 0 ? (provider.neighborhoods / maxNeighborhoods) * 100 : 0;

              return (
                <div key={provider.providerId} className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{provider.providerName}</p>

                      <p className="text-xs text-muted-foreground">
                        {provider.records} {provider.records === 1 ? "registro" : "registros"}
                      </p>
                    </div>

                    <span className="shrink-0 text-sm font-medium">
                      {provider.neighborhoods} {provider.neighborhoods === 1 ? "bairro" : "bairros"}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState />
        )}
      </CardContent>
    </Card>
  );
}
