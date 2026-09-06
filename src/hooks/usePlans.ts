import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Plan = Database["public"]["Tables"]["plans"]["Row"];

type PlanInsert = Database["public"]["Tables"]["plans"]["Insert"];

type PlanUpdate = Database["public"]["Tables"]["plans"]["Update"];

export function usePlans(providerId: string) {
  return useQuery<Plan[]>({
    queryKey: ["plans", providerId],

    queryFn: async () => {
      const { data, error } = await supabase
        .from("plans")
        .select("*")
        .eq("provider_id", providerId)
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        throw error;
      }

      return data;
    },

    enabled: Boolean(providerId),
  });
}

export function usePlan(id?: string) {
  return useQuery({
    queryKey: ["plan", id],

    queryFn: async () => {
      if (!id) {
        return null;
      }

      const { data, error } = await supabase.from("plans").select("*").eq("id", id).single();

      if (error) {
        throw error;
      }

      return data;
    },

    enabled: Boolean(id),
  });
}

export function useCreatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (plan: PlanInsert) => {
      const { data, error } = await supabase.from("plans").insert(plan).select().single();

      if (error) {
        throw error;
      }

      return data;
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["plans", variables.provider_id],
      });
    },
  });
}

type UpdatePlanVariables = {
  id: string;
  providerId: string;
  data: PlanUpdate;
};

export function useUpdatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: UpdatePlanVariables) => {
      const { data: updatedPlan, error } = await supabase
        .from("plans")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return updatedPlan;
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["plans", variables.providerId],
      });

      queryClient.invalidateQueries({
        queryKey: ["plan", variables.id],
      });
    },
  });
}

type DeletePlanVariables = {
  id: string;
  providerId: string;
};

export function useDeletePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DeletePlanVariables) => {
      const { error } = await supabase.from("plans").delete().eq("id", data.id);

      if (error) {
        throw error;
      }
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["plans", variables.providerId],
      });
    },
  });
}
