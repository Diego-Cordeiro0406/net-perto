import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { Neighborhood } from "@/types/types";

type UseNeighborhoodsOptions = {
  city?: string;
  state?: string;
};

export type ProviderCoverageWithNeighborhood =
  Database["public"]["Tables"]["provider_coverage"]["Row"] & {
    neighborhoods: {
      id: string;
      name: string;
    } | null;
  };

export function useNeighborhoods({
  city = "Petrolina",
  state = "PE",
}: UseNeighborhoodsOptions = {}) {
  return useQuery<Neighborhood[]>({
    queryKey: ["neighborhoods", city, state],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("neighborhoods")
        .select("id, name, city, slug")
        .eq("city", city)
        .eq("state", state)
        .order("name");

      if (error) throw error;

      return data;
    },
  });
}

export function useSingleNeighborhood(id?: string) {
  return useQuery({
    queryKey: ["neighborhood", id],

    queryFn: async () => {
      if (!id) {
        return null;
      }

      const { data, error } = await supabase
        .from("neighborhoods")
        .select("id, name")
        .eq("id", id)
        .single();

      if (error) {
        throw error;
      }

      return data;
    },

    enabled: Boolean(id),
  });
}

export function useNeighborhoodBySlug(city?: string, slug?: string) {
  return useQuery({
    queryKey: ["neighborhood", city, slug],

    queryFn: async () => {
      if (!city || !slug) {
        return null;
      }

      const { data, error } = await supabase
        .from("neighborhoods")
        .select("id, name, city, state, slug")
        .eq("city", "Petrolina")
        .eq("slug", slug)
        .single();

      if (error) {
        throw error;
      }

      return data;
    },

    enabled: Boolean(city && slug),
  });
}
