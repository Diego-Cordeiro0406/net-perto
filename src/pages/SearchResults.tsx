import { ArrowUpDown } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { ProviderResultSection } from "@/components/ProviderResultSection";
import { usePlansByNeighborhood } from "@/hooks/usePlansByNeighborhood.ts";
import type { ProviderGroup } from "@/types/types";
import { useNeighborhoodBySlug } from "@/hooks/useNeighborhoods";
import { SearchResultsSkeleton } from "@/components/skeletons/SearchResultsSkeleton";
import { useEffect, useMemo, useRef, useState } from "react";
import { getCoveragePriority, getPlanPrice } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BASE_URL, SORT_LABELS } from "@/lib/constants";
import { trackNoResults, trackSortChange } from "@/lib/analytics";
import { PaginationComponent } from "@/components/Pagination";
import { PageSEO } from "@/components/PageSEO";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type SortBy = "price" | "download" | "upload";
const PROVIDERS_PER_PAGE = 4;

export default function SearchResults() {
  const [sortBy, setSortBy] = useState<SortBy | null>("price");
  const [currentPage, setCurrentPage] = useState(1);
  const resultsRef = useRef<HTMLHeadingElement>(null);

  const { city, neighborhoodSlug } = useParams<{
    city: string;
    neighborhoodSlug: string;
  }>();

  const { data: neighborhood, isPending: isNeighborhoodPending } = useNeighborhoodBySlug(
    city,
    neighborhoodSlug
  );

  const {
    data: plans,
    isPending: isPlansPending,
    isError,
  } = usePlansByNeighborhood(neighborhood?.id);

  const pageUrl = `${BASE_URL}/internet/${city}/${neighborhoodSlug}`;

  const jsonLd = neighborhood
    ? [
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: `Internet no ${neighborhood.name} de ${neighborhood.city} | NetPerto`,
          description: `Compare provedores e planos de internet disponíveis no bairro ${neighborhood.name}, em ${neighborhood.city}.`,
          url: pageUrl,
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Início",
              item: BASE_URL,
            },
            // {
            //   "@type": "ListItem",
            //   position: 2,
            //   name: neighborhood.city,
            // },
            {
              "@type": "ListItem",
              position: 2,
              name: neighborhood.name,
              item: pageUrl,
            },
          ],
        },
      ]
    : undefined;

  const isLoadingResults = isNeighborhoodPending || isPlansPending;
  const hasTrackedNoResults = useRef(false);

  useEffect(() => {
    if (
      !isLoadingResults &&
      !isError &&
      plans &&
      plans.length === 0 &&
      !hasTrackedNoResults.current
    ) {
      trackNoResults(
        neighborhood
          ? {
              id: neighborhood.id,
              name: neighborhood.name,
            }
          : undefined
      );

      hasTrackedNoResults.current = true;
    }
  }, [isLoadingResults, isError, plans, neighborhood]);

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
  const providers = useMemo(() => {
    const grouped = Array.from(
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
            coverageStatus: plan.coverageStatus,
          });
        }

        return map;
      }, new Map<string, ProviderGroup>())
    ).map(([, value]) => value);

    return grouped.sort(
      (a, b) => getCoveragePriority(a.coverageStatus) - getCoveragePriority(b.coverageStatus)
    );
  }, [sortedPlans]);

  const totalPages = Math.ceil(providers.length / PROVIDERS_PER_PAGE);

  const paginatedProviders = useMemo(() => {
    const startIndex = (currentPage - 1) * PROVIDERS_PER_PAGE;
    const endIndex = startIndex + PROVIDERS_PER_PAGE;

    return providers.slice(startIndex, endIndex);
  }, [providers, currentPage]);

  function handleSortChange(value: SortBy | null) {
    if (!value) {
      return;
    }

    setSortBy(value);
    setCurrentPage(1);
    trackSortChange(value);
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {neighborhood && (
        <PageSEO
          title={`Internet no bairro ${neighborhood.name} de ${neighborhood.city} | NetPerto`}
          description={`Compare provedores e planos de internet disponíveis no bairro ${neighborhood.name}, em ${neighborhood.city}.`}
          canonical={`/internet/${city}/${neighborhoodSlug}`}
          jsonLd={jsonLd}
        />
      )}

      <section className="mx-auto max-w-7xl space-y-8">
        {/* Cabeçalho */}
        <section className="animate-fade-up space-y-4" style={{ animationDelay: "0ms" }}>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link to="/" />}>Início</BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              {/* <BreadcrumbItem>{neighborhood && neighborhood.city}</BreadcrumbItem>

              <BreadcrumbSeparator /> */}

              <BreadcrumbItem>
                <BreadcrumbPage>{neighborhood && neighborhood.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div ref={resultsRef}>
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

              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-full sm:w-48">
                  <ArrowUpDown />
                  <SelectValue>{sortBy && SORT_LABELS[sortBy]}</SelectValue>
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
              {paginatedProviders.map(({ provider, plans, coverageStatus }, index) => (
                <div
                  key={provider.id}
                  className="animate-fade-up"
                  style={{
                    animationDelay: `${Math.min(250 + index * 100, 650)}ms`,
                  }}
                >
                  <ProviderResultSection
                    provider={provider}
                    plans={plans}
                    coverageStatus={coverageStatus}
                  />
                </div>
              ))}
            </div>
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);

                resultsRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
            />
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
