import { ArrowLeft, ArrowUpDown } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { ProviderResultSection } from "@/components/ProviderResultSection";
import { usePlansByCep } from "@/hooks/usePlansByCep";
import { formatZipCode } from "@/lib/formatters";
import type { ProviderGroup } from "@/types/types";

export default function SearchResults() {
  const [searchParams] = useSearchParams();

  const cep = searchParams.get("cep") ?? "";

  const { data: plans, isLoading, error } = usePlansByCep(cep);

  /**
   * Agrupa os planos por provedor.
   */
  const providers: ProviderGroup[] = plans
    ? Array.from(
        plans.reduce((map, plan) => {
          if (!plan.provider) {
            return map;
          }

          const existing = map.get(plan.provider.id);

          if (existing) {
            existing.plans.push(plan);
          } else {
            map.set(plan.provider.id, {
              provider: plan.provider,
              plans: [plan],
            });
          }

          return map;
        }, new Map())
      ).map(([, value]) => value)
    : [];

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Cabeçalho */}
        <div className="space-y-4">
          <Button nativeButton={false} className="p-0" variant="ghost" render={<Link to="/" />}>
            <ArrowLeft />
            Nova busca
          </Button>

          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Internet disponível na sua região
            </h1>

            <p className="mt-2 text-muted-foreground">
              Confira os planos disponíveis para o CEP <strong>{formatZipCode(cep)}</strong>.
            </p>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="py-12 text-center text-muted-foreground">
            Buscando planos disponíveis...
          </div>
        )}

        {/* Erro */}
        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
            <h2 className="font-semibold text-destructive">Não foi possível realizar a busca</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Tente novamente em alguns instantes.
            </p>
          </div>
        )}

        {/* Resultados */}
        {!isLoading && !error && plans && plans.length > 0 && (
          <div className="space-y-8">
            {/* Resumo + ordenação */}
            <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Encontramos</p>

                <p className="text-lg font-semibold">
                  {providers.length} {providers.length === 1 ? "provedor" : "provedores"} e{" "}
                  {plans.length} {plans.length === 1 ? "plano" : "planos"}
                </p>
              </div>

              {/* Ordenação — visual por enquanto */}
              <Button variant="outline">
                <ArrowUpDown />
                Menor preço
              </Button>
            </div>

            {/* ProvednativeButton={false}ores */}
            <div className="space-y-10">
              {providers.map(({ provider, plans }) => (
                <ProviderResultSection key={provider.id} provider={provider} plans={plans} />
              ))}
            </div>
          </div>
        )}

        {/* Nenhum resultado */}
        {!isLoading && !error && (!plans || plans.length === 0) && (
          <div className="rounded-xl border border-dashed p-10 text-center">
            <h2 className="text-lg font-semibold">Nenhum plano encontrado</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Não encontramos planos de internet disponíveis para este CEP.
            </p>

            <Button className="mt-6" render={<Link to="/" />}>
              Fazer nova busca
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
