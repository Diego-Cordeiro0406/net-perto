import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { searchSchema, type SearchFormData } from "@/lib/validators";
import { PageSEO } from "@/components/PageSEO";
import { NeighborhoodAutocomplete } from "@/components/NeighborhoodAutocomplete";
import { useTheme } from "next-themes";
import { useState } from "react";
import { trackSearch } from "@/lib/analytics";
import type { SelectedNeighborhood } from "@/types/types";

export default function Index() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [selectedNeighborhood, setSelectedNeighborhood] = useState<SelectedNeighborhood | null>(
    null
  );

  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      neighborhoodId: "",
    },
  });

  const neighborhoodId = useWatch({
    control,
    name: "neighborhoodId",
  });

  const onSubmit = (data: SearchFormData) => {
    if (selectedNeighborhood) {
      trackSearch(selectedNeighborhood);
    }

    navigate(`/search?neighborhood=${data.neighborhoodId}`);
  };

  return (
    <section className="flex min-h-full items-center justify-center px-4">
      <PageSEO
        title="Encontre internet em Petrolina"
        description="Encontre e compare provedores e planos de internet disponíveis em Petrolina, Pernambuco."
        canonical="/"
      />

      <main className="space-y-5">
        <section className="space-y-5 flex flex-col items-center">
          <div
            className={`animate-fade-up inline-flex items-center rounded-full ${theme === "light" ? "bg-connectivity/10" : "bg-connectivity"} px-3 py-1 text-sm font-medium text-connectivity-foreground`}
            style={{ animationDelay: "0ms" }}
          >
            Compare provedores da sua região
          </div>

          <h1
            className="animate-fade-up text-4xl font-bold tracking-tight sm:text-5xl"
            style={{ animationDelay: "100ms" }}
          >
            Encontre internet para sua região
          </h1>

          <p
            className="animate-fade-up text-lg text-muted-foreground sm:text-xl"
            style={{ animationDelay: "200ms" }}
          >
            Descubra provedores e planos disponíveis no seu bairro.
          </p>
        </section>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="animate-fade-up mx-auto w-full max-w-xl pt-4"
          style={{ animationDelay: "300ms" }}
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <NeighborhoodAutocomplete
                value={neighborhoodId}
                onValueChange={(neighborhood) => {
                  setSelectedNeighborhood(neighborhood);

                  setValue("neighborhoodId", neighborhood?.id ?? "", {
                    shouldValidate: true,
                  });
                }}
                disabled={isSubmitting}
                placeholder="Digite seu bairro"
              />
            </div>

            <Button type="submit" size="lg" className="h-12 px-8" disabled={isSubmitting}>
              {isSubmitting ? "Buscando..." : "Buscar"}
            </Button>
          </div>

          {errors.neighborhoodId && (
            <p className="mt-2 text-left text-sm text-destructive">
              {errors.neighborhoodId.message}
            </p>
          )}
        </form>
      </main>
    </section>
  );
}
