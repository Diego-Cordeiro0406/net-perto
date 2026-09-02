import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { toast } from "@/components/ui/toast";
import { formatZipCode } from "@/lib/formatters";

type ProviderCoverage = Database["public"]["Tables"]["provider_coverage"]["Row"];

type CreateProviderCoverageData = Database["public"]["Tables"]["provider_coverage"]["Insert"];

type UpdateProviderCoverageData = Database["public"]["Tables"]["provider_coverage"]["Update"];

export function useProviderCoverage(providerId?: string) {
  return useQuery<ProviderCoverage[]>({
    queryKey: ["provider-coverage", providerId],

    enabled: Boolean(providerId),

    queryFn: async () => {
      if (!providerId) {
        throw new Error("ID do provedor não informado.");
      }

      const { data, error } = await supabase
        .from("provider_coverage")
        .select("*")
        .eq("provider_id", providerId)
        .order("zip_code");

      if (error) {
        throw error;
      }

      return data;
    },
  });
}

export function useCreateProviderCoverage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (coverage: CreateProviderCoverageData) => {
      const { data, error } = await supabase
        .from("provider_coverage")
        .insert(coverage)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },

    onSuccess: (coverage) => {
      queryClient.invalidateQueries({
        queryKey: ["provider-coverage", coverage.provider_id],
      });
      toast.add({
        title: "Cobertura adicionada com sucesso!",
        description: `A cobertura ao cep ${formatZipCode(coverage.zip_code)} foi adicionada com sucesso!`,
      });
    },
  });
}

export function useUpdateProviderCoverage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateProviderCoverageData }) => {
      const { data: coverage, error } = await supabase
        .from("provider_coverage")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return coverage;
    },

    onSuccess: (coverage) => {
      queryClient.invalidateQueries({
        queryKey: ["provider-coverage", coverage.provider_id],
      });
      toast.add({
        title: "Cobertura atualizada com sucesso!",
        description: `A cobertura ao cep ${formatZipCode(coverage.zip_code)} foi atualizada com sucesso!`,
      });
    },
  });
}

export function useDeleteProviderCoverage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, providerId }: { id: string; providerId: string }) => {
      const { error } = await supabase.from("provider_coverage").delete().eq("id", id);

      if (error) {
        throw error;
      }

      return {
        id,
        providerId,
      };
    },

    onSuccess: ({ providerId }) => {
      queryClient.invalidateQueries({
        queryKey: ["provider-coverage", providerId],
      });
    },
  });
}
