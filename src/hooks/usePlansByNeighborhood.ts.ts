import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import type { PlanBenefit } from "@/types/types";

function parseBenefits(benefits: unknown): PlanBenefit[] {
  if (!Array.isArray(benefits)) {
    return [];
  }

  return benefits.filter(
    (benefit): benefit is PlanBenefit =>
      typeof benefit === "object" &&
      benefit !== null &&
      "name" in benefit &&
      typeof benefit.name === "string"
  );
}

export function usePlansByNeighborhood(neighborhoodId?: string) {
  return useQuery({
    queryKey: ["plans-by-neighborhood", neighborhoodId],

    queryFn: async () => {
      const { data: coverages, error: coverageError } = await supabase
        .from("provider_coverage")
        .select(
          `
            provider_id,
            status,

            providers (
              id,
              name,
              website,
              description,
              logo_url
            )
          `
        )
        .eq("neighborhood_id", neighborhoodId!)
        .in("status", ["available", "unknown"]);

      if (coverageError) {
        throw coverageError;
      }

      if (!coverages || coverages.length === 0) {
        return [];
      }

      const providerIds = coverages.map((coverage) => coverage.provider_id);

      const { data: plans, error: plansError } = await supabase
        .from("plans")
        .select("*")
        .in("provider_id", providerIds)
        .eq("is_active", true)
        .order("price", {
          ascending: true,
        });

      if (plansError) {
        throw plansError;
      }

      const providersMap = new Map(
        coverages.map((coverage) => [
          coverage.provider_id,
          {
            provider: coverage.providers,
            coverageStatus: coverage.status as "available" | "unknown" | null,
          },
        ])
      );

      return (
        plans?.map((plan) => {
          const providerData = providersMap.get(plan.provider_id);

          return {
            ...plan,

            benefits: parseBenefits(plan.benefits),

            provider: providerData?.provider ?? null,

            coverageStatus: providerData?.coverageStatus ?? null,
          };
        }) ?? []
      );
    },

    enabled: Boolean(neighborhoodId),
  });
}
