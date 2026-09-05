import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { searchSchema, type SearchFormData } from "@/lib/validators";
import { PageSEO } from "@/components/PageSEO";
import { NeighborhoodAutocomplete } from "@/components/NeighborhoodAutocomplete";

export default function Index() {
  const navigate = useNavigate();

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
    navigate(`/search?neighborhood=${data.neighborhoodId}`);
  };

  return (
    <section className="flex min-h-full items-center justify-center px-4">
      <PageSEO
        title="Encontre internet em Petrolina"
        description="Encontre e compare provedores e planos de internet disponíveis em Petrolina, Pernambuco."
        canonical="/"
      />

      <section className="w-full max-w-3xl text-center">
        <div className="space-y-5">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Encontre internet para sua região
          </h1>

          <p className="text-lg text-muted-foreground sm:text-xl">
            Descubra provedores e planos disponíveis no seu bairro.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mx-auto w-full max-w-xl pt-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex-1">
                <NeighborhoodAutocomplete
                  value={neighborhoodId}
                  onValueChange={(value) => {
                    setValue("neighborhoodId", value, {
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
        </div>
      </section>
    </section>
  );
}
