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

export function usePlansByCep(cep?: string) {
  const cleanCep = cep?.replace(/\D/g, "") ?? "";

  return useQuery({
    queryKey: ["plans-by-cep", cleanCep],

    queryFn: async () => {
      const { data: coverages, error: coverageError } = await supabase
        .from("provider_coverage")
        .select(
          `
            provider_id,

            providers (
              id,
              name,
              website,
              description,
              logo_url
            )
          `
        )
        .eq("zip_code", cleanCep)
        .eq("status", "available");

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
        coverages.map((coverage) => [coverage.provider_id, coverage.providers])
      );

      return plans?.map((plan) => ({
        ...plan,

        benefits: parseBenefits(plan.benefits),

        provider: providersMap.get(plan.provider_id) ?? null,
      }));
    },

    enabled: cleanCep.length === 8,
  });
}
