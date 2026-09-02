import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Provider = Database["public"]["Tables"]["providers"]["Row"];

type CreateProviderData = Database["public"]["Tables"]["providers"]["Insert"];

type UpdateProviderData = Database["public"]["Tables"]["providers"]["Update"];

/**
 * Lista todos os provedores.
 */
export function useProviders() {
  return useQuery<Provider[]>({
    queryKey: ["providers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("providers")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        throw error;
      }

      return data;
    },
  });
}

/**
 * Busca um provedor pelo ID.
 */
export function useProvider(id?: string) {
  return useQuery({
    queryKey: ["provider", id],
    enabled: Boolean(id),
    queryFn: async () => {
      if (!id) {
        throw new Error("ID do provedor não informado.");
      }

      const { data, error } = await supabase.from("providers").select("*").eq("id", id).single();

      if (error) {
        throw error;
      }

      return data;
    },
  });
}

/**
 * Cria um novo provedor.
 */
export function useCreateProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (provider: CreateProviderData) => {
      const { data, error } = await supabase.from("providers").insert(provider).select().single();

      if (error) {
        throw error;
      }

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["providers"],
      });
    },
  });
}

/**
 * Atualiza um provedor existente.
 */
export function useUpdateProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateProviderData }) => {
      const { data: provider, error } = await supabase
        .from("providers")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return provider;
    },

    onSuccess: (provider) => {
      queryClient.invalidateQueries({
        queryKey: ["providers"],
      });

      queryClient.invalidateQueries({
        queryKey: ["provider", provider.id],
      });
    },
  });
}

/**
 * Exclui um provedor.
 */
export function useDeleteProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("providers").delete().eq("id", id);

      if (error) {
        throw error;
      }
    },

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["providers"],
      });

      queryClient.removeQueries({
        queryKey: ["provider", id],
      });
    },
  });
}
