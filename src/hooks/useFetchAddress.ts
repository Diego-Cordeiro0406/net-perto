import { supabase } from "@/integrations/supabase/client";

export async function fetchAddress(cep: string) {
  const { data, error } = await supabase.functions.invoke("get-address-by-cep", {
    body: { cep },
  });

  if (error) {
    throw error;
  }

  return data as {
    street: string;
    neighborhood: string;
  };
}
