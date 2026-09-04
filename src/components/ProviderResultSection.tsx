import { ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlanResultCard } from "@/components/PlanResultCard";
import type { ProviderGroup } from "@/types/types";

export function ProviderResultSection({ provider, plans }: ProviderGroup) {
  return (
    <section className="space-y-4">
      {/* Cabeçalho do provedor */}
      <Card className="p-5 border-none">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted">
              {provider.logo_url ? (
                <img
                  src={provider.logo_url}
                  alt={`Logo ${provider.name}`}
                  className="size-full object-contain"
                />
              ) : (
                <span className="text-lg font-semibold text-muted-foreground">
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
          >
            Visitar site do provedor
            <ExternalLink />
          </Button>
        </div>
      </Card>

      {/* Planos */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {plans.map((plan) => (
          <PlanResultCard key={plan.id} plan={plan} />
        ))}
      </div>
    </section>
  );
}
