import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { providerSchema, type ProviderFormData } from "@/lib/validators";

import { useCreateProvider, useProvider, useUpdateProvider } from "@/hooks/useProviders";

export default function ProviderForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditing = Boolean(id);

  const { data: provider, isLoading: isLoadingProvider, error: providerError } = useProvider(id);

  const createProvider = useCreateProvider();
  const updateProvider = useUpdateProvider();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProviderFormData>({
    resolver: zodResolver(providerSchema),
    defaultValues: {
      name: "",
      website: "",
      description: "",
    },
  });

  useEffect(() => {
    if (provider) {
      reset({
        name: provider.name,
        website: provider.website,
        description: provider.description ?? "",
      });
    }
  }, [provider, reset]);

  const onSubmit = async (data: ProviderFormData) => {
    try {
      if (isEditing && id) {
        await updateProvider.mutateAsync({
          id,
          data: {
            name: data.name,
            website: data.website,
            description: data.description || null,
          },
        });
      } else {
        await createProvider.mutateAsync({
          name: data.name,
          website: data.website,
          description: data.description || null,
        });
      }

      navigate("/admin/providers");
    } catch (error) {
      console.error("Erro ao salvar provedor:", error);
    }
  };

  const isSubmitting = createProvider.isPending || updateProvider.isPending;

  const mutationError = createProvider.error || updateProvider.error;

  if (isEditing && isLoadingProvider) {
    return (
      <section className="mx-auto w-full max-w-2xl">
        <div className="flex h-40 items-center justify-center">
          <p className="text-sm text-muted-foreground">Carregando provedor...</p>
        </div>
      </section>
    );
  }

  if (isEditing && providerError) {
    return (
      <section className="mx-auto w-full max-w-2xl">
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          Não foi possível carregar o provedor.
        </div>

        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={() => navigate("/admin/providers")}
        >
          Voltar
        </Button>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          {isEditing ? "Editar provedor" : "Novo provedor"}
        </h1>

        <p className="text-sm text-muted-foreground">
          {isEditing
            ? "Atualize as informações do provedor."
            : "Cadastre um novo provedor de internet."}
        </p>
      </div>

      {mutationError && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          Não foi possível salvar o provedor.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Nome
          </label>

          <Input id="name" placeholder="Ex.: NetPerto Fibra" {...register("name")} />

          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="website" className="text-sm font-medium">
            Site
          </label>

          <Input
            id="website"
            type="url"
            placeholder="https://exemplo.com.br"
            {...register("website")}
          />

          {errors.website && <p className="text-sm text-destructive">{errors.website.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Descrição
          </label>

          <Textarea
            id="description"
            placeholder="Descreva brevemente o provedor..."
            rows={5}
            {...register("description")}
          />

          {errors.description && (
            <p className="text-sm text-destructive">{errors.description.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/providers")}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : isEditing ? "Salvar alterações" : "Salvar provedor"}
          </Button>
        </div>
      </form>
    </section>
  );
}
