import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { searchSchema, type SearchFormData } from "@/lib/validators";

export default function Index() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      zipCode: "",
    },
  });

  const onSubmit = (data: SearchFormData) => {
    console.log("CEP:", data.zipCode);
  };

  return (
    <section className="flex min-h-full items-center justify-center px-4">
      <section className="w-full max-w-3xl text-center">
        <div className="space-y-5">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Encontre internet para sua região
          </h1>

          <p className="text-lg text-muted-foreground sm:text-xl">
            Descubra provedores e planos disponíveis em Petrolina.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mx-auto w-full max-w-xl pt-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <MapPin
                  className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />

                <Input
                  {...register("zipCode")}
                  type="text"
                  inputMode="numeric"
                  placeholder="Digite seu CEP"
                  className="h-12 pl-10 text-base"
                  maxLength={9}
                  aria-invalid={!!errors.zipCode}
                />
              </div>

              <Button type="submit" size="lg" className="h-12 px-8" disabled={isSubmitting}>
                {isSubmitting ? "Buscando..." : "Buscar"}
              </Button>
            </div>

            {errors.zipCode && (
              <p className="mt-2 text-left text-sm text-destructive">{errors.zipCode.message}</p>
            )}
          </form>
        </div>
      </section>
    </section>
  );
}
