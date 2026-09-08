import { CircleAlert, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlanResultCard } from "@/components/PlanResultCard";
import type { ProviderGroup } from "@/types/types";
import { getPublicUrl } from "@/lib/storage";
import { trackProviderWebsiteClick } from "@/lib/analytics";

export function ProviderResultSection({ provider, plans, coverageStatus }: ProviderGroup) {
  return (
    <section className="space-y-4">
      {/* Cabeçalho do provedor */}
      <Card className="border-border/70 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted">
              {provider.logo_url ? (
                <img
                  src={getPublicUrl("providers-logos", provider.logo_url)}
                  alt={`Logo ${provider.name}`}
                  className="size-full object-contain"
                />
              ) : (
                <span className="text-lg font-bold text-primary">
                  {provider.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <div>
              <h2 className="text-lg font-semibold">{provider.name}</h2>

              <p className="text-sm text-muted-foreground">
                {plans.length} {plans.length === 1 ? "plano disponível" : "planos disponíveis"}
              </p>
            </div>
          </div>

          <Button
            nativeButton={false}
            variant="outline"
            render={<a href={provider.website} target="_blank" rel="noopener noreferrer" />}

            onClick={() => {
              trackProviderWebsiteClick({ name: provider.name, id: provider.id });
            }}
          >
            Visitar site do provedor
            <ExternalLink />
          </Button>
        </div>
      </Card>

      {coverageStatus === "unknown" && (
        <div className="flex gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
          <CircleAlert className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />

          <div>
            <p className="text-sm font-medium">Cobertura não confirmada</p>

            <p className="mt-1 text-sm text-muted-foreground">
              Este provedor atua em Petrolina, mas ainda não conseguimos confirmar a cobertura no
              seu bairro. Consulte o provedor para verificar a disponibilidade.
            </p>
          </div>
        </div>
      )}

      {/* Planos */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {plans.map((plan) => (
          <PlanResultCard key={plan.id} plan={plan} />
        ))}
      </div>
    </section>
  );
}
