import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";

type DashboardStats = {
  providers: number;
  plans: number;
  coverage: number;
};

type CoverageSummary = {
  records: number;
  neighborhoods: number;
  providers: number;
};

type CoverageByProvider = {
  providerId: string;
  providerName: string;
  neighborhoods: number;
  records: number;
};

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],

    queryFn: async () => {
      const [
        providersCountResult,
        plansCountResult,
        coverageResult,
        recentProvidersResult,
        recentPlansResult,
      ] = await Promise.all([
        supabase.from("providers").select("*", {
          count: "exact",
          head: true,
        }),

        supabase.from("plans").select("*", {
          count: "exact",
          head: true,
        }),

        supabase.from("provider_coverage").select(
          `
              id,
              provider_id,
              neighborhood_id,
              providers (
                id,
                name
              )
            `
        ),

        supabase
          .from("providers")
          .select("id, name, website, created_at")
          .order("created_at", {
            ascending: false,
          })
          .limit(5),

        supabase
          .from("plans")
          .select(
            `
              id,
              name,
              price,
              download_speed,
              upload_speed,
              created_at,
              provider_id,
              providers (
                id,
                name
              )
            `
          )
          .order("created_at", {
            ascending: false,
          })
          .limit(5),
      ]);

      if (providersCountResult.error) {
        throw providersCountResult.error;
      }

      if (plansCountResult.error) {
        throw plansCountResult.error;
      }

      if (coverageResult.error) {
        throw coverageResult.error;
      }

      if (recentProvidersResult.error) {
        throw recentProvidersResult.error;
      }

      if (recentPlansResult.error) {
        throw recentPlansResult.error;
      }

      const coverage = coverageResult.data;

      const neighborhoodIds = new Set(coverage.map((item) => item.neighborhood_id));

      const providerIds = new Set(coverage.map((item) => item.provider_id));

      const coverageByProviderMap = new Map<
        string,
        {
          providerId: string;
          providerName: string;
          neighborhoods: Set<string>;
          records: number;
        }
      >();

      coverage.forEach((item) => {
        const providerId = item.provider_id;
        const providerName = item.providers?.name ?? "Provedor não encontrado";

        const current = coverageByProviderMap.get(providerId);

        if (!current) {
          coverageByProviderMap.set(providerId, {
            providerId,
            providerName,
            neighborhoods: new Set([item.neighborhood_id]),
            records: 1,
          });

          return;
        }

        current.neighborhoods.add(item.neighborhood_id);
        current.records += 1;
      });

      const coverageByProvider: CoverageByProvider[] = Array.from(coverageByProviderMap.values())
        .map((provider) => ({
          providerId: provider.providerId,
          providerName: provider.providerName,
          neighborhoods: provider.neighborhoods.size,
          records: provider.records,
        }))
        .sort((a, b) => b.neighborhoods - a.neighborhoods);

      return {
        stats: {
          providers: providersCountResult.count ?? 0,
          plans: plansCountResult.count ?? 0,
          coverage: coverage.length,
        } satisfies DashboardStats,

        coverageSummary: {
          records: coverage.length,
          neighborhoods: neighborhoodIds.size,
          providers: providerIds.size,
        } satisfies CoverageSummary,

        coverageByProvider,

        recentProviders: recentProvidersResult.data,
        recentPlans: recentPlansResult.data,
      };
    },
  });
}
