import { ArrowLeft, ArrowUpDown } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { ProviderResultSection } from "@/components/ProviderResultSection";
import { usePlansByNeighborhood } from "@/hooks/usePlansByNeighborhood.ts";
import type { ProviderGroup } from "@/types/types";
import { useSingleNeighborhood } from "@/hooks/useNeighborhoods";
import { SearchResultsSkeleton } from "@/components/skeletons/SearchResultsSkeleton";
import { useMemo, useState } from "react";
import { getPlanPrice } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SORT_LABELS } from "@/lib/constants";

export default function SearchResults() {
  const [searchParams] = useSearchParams();

  const [sortBy, setSortBy] = useState<"price" | "download" | "upload">("price");

  const neighborhoodParam = searchParams.get("neighborhood") ?? "";
  const { data: neighborhood, isPending: isNeighborhoodPending } =
    useSingleNeighborhood(neighborhoodParam);

  const {
    data: plans,
    isPending: isPlansPending,
    isError,
  } = usePlansByNeighborhood(neighborhood?.id);

  const isLoadingResults = isNeighborhoodPending || isPlansPending;

  const sortedPlans = useMemo(() => {
    if (!plans) {
      return [];
    }

    return [...plans].sort((a, b) => {
      switch (sortBy) {
        case "download":
          return b.download_speed - a.download_speed;

        case "upload":
          return b.upload_speed - a.upload_speed;

        case "price":
        default:
          return getPlanPrice(a) - getPlanPrice(b);
      }
    });
  }, [plans, sortBy]);

  /**
   * Agrupa os planos por provedor.
   */
  const providers: ProviderGroup[] = Array.from(
    sortedPlans.reduce((map, plan) => {
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
  ).map(([, value]) => value);

  return (
    <main className="container mx-auto px-4 py-8">
      <section className="mx-auto max-w-7xl space-y-8">
        {/* Cabeçalho */}
        <section className="animate-fade-up space-y-4" style={{ animationDelay: "0ms" }}>
          <Button
            nativeButton={false}
            className="p-0 text-muted-foreground hover:text-primary"
            variant="ghost"
            render={<Link to="/" />}
          >
            <ArrowLeft />
            Nova busca
          </Button>

          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Internet disponível na sua região
            </h1>

            <p className="mt-2 text-muted-foreground">
              Confira os planos disponíveis para o Bairro{" "}
              <strong className="font-semibold text-foreground">{neighborhood?.name}</strong>.
            </p>
          </div>
        </section>

        {/* Loading */}
        {isLoadingResults && <SearchResultsSkeleton />}

        {/* Erro */}
        {isError && (
          <div
            className="animate-fade-up rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-center"
            style={{ animationDelay: "100ms" }}
          >
            <h2 className="font-semibold text-destructive">Não foi possível realizar a busca</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Tente novamente em alguns instantes.
            </p>
          </div>
        )}

        {/* Resultados */}
        {!isLoadingResults && !isError && plans && plans.length > 0 && (
          <main className="space-y-8">
            {/* Resumo + ordenação */}
            <div
              className="animate-fade-up flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between"
              style={{ animationDelay: "150ms" }}
            >
              <div>
                <p className="text-sm text-muted-foreground">Encontramos</p>

                <p className="text-lg font-semibold">
                  {providers.length} {providers.length === 1 ? "provedor" : "provedores"} e{" "}
                  {plans.length} {plans.length === 1 ? "plano" : "planos"}
                </p>
              </div>

              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value as "price" | "download" | "upload")}
              >
                <SelectTrigger className="w-full sm:w-48">
                  <ArrowUpDown />
                  <SelectValue>{SORT_LABELS[sortBy]}</SelectValue>
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="price">Menor preço</SelectItem>

                  <SelectItem value="download">Maior download</SelectItem>

                  <SelectItem value="upload">Maior upload</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* ProvednativeButton={false}ores */}
            <div className="space-y-10">
              {providers.map(({ provider, plans }, index) => (
                <div
                  key={provider.id}
                  className="animate-fade-up"
                  style={{
                    animationDelay: `${Math.min(250 + index * 100, 650)}ms`,
                  }}
                >
                  <ProviderResultSection provider={provider} plans={plans} />
                </div>
              ))}
            </div>
          </main>
        )}

        {/* Nenhum resultado */}
        {!isLoadingResults && !isError && (!plans || plans.length === 0) && (
          <div
            className="animate-fade-up rounded-xl border border-dashed p-10 text-center"
            style={{ animationDelay: "150ms" }}
          >
            <h2 className="text-lg font-semibold">Nenhum plano encontrado</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Não encontramos planos de internet disponíveis para este Bairro.
            </p>

            <Button nativeButton={false} className="mt-6" render={<Link to="/" />}>
              Fazer nova busca
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}
