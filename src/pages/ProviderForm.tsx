import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { providerSchema, type ProviderFormData } from "@/lib/validators";

import { useCreateProvider, useProvider, useUpdateProvider } from "@/hooks/useProviders";
import { getPublicUrl } from "@/lib/storage";
import { toast } from "@/components/ui/toast";
import { ProviderPhotoUpload } from "@/components/ProviderPhotoUpload";
import { Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { saveProviderLogo } from "@/services/providerLogo";
import { PageLoading } from "@/components/PageLoading";

export default function ProviderForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLogo, setNewLogo] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const isEditing = Boolean(id);

  const { data: provider, isLoading: isLoadingProvider, error: providerError } = useProvider(id);
  const currentLogo = provider?.logo_url ?? null;

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

  async function handleSaveAvatar() {
    if (!newLogo || !provider) return;

    try {
      setIsSaving(true);

      await saveProviderLogo({
        providerId: provider.id,
        newLogo,
        currentLogo: provider.logo_url,
      });

      setNewLogo(null);
      setIsModalOpen(false);

      toast.add({
        title: "Logo atualizada!",
        description: "A logo do provedor foi atualizada com sucesso.",
      });
    } catch (error) {
      console.error(error);

      toast.add({
        title: "Erro ao atualizar logo",
        description: "Não foi possível atualizar a logo do provedor.",
        type: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }

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
    return <PageLoading message="Carregando provedor..." />;
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
        <section className="flex items-center justify-center relative group">
          <Avatar className="h-28 w-28 border-4 border-background shadow-xl">
            <AvatarImage
              src={
                provider?.logo_url ? getPublicUrl("providers-logos", provider.logo_url) : undefined
              }
            />
            <AvatarFallback className="text-2xl bg-linear-to-br from-purple-500 to-pink-500 text-white">
              P
            </AvatarFallback>
          </Avatar>
          <label
            htmlFor="logo-upload"
            className="absolute bottom-0 right-72 h-8 w-8 rounded-full shadow-lg transition-opacity cursor-pointer"
          >
            <Button
              id="logo-upload"
              size="icon"
              onClick={() => setIsModalOpen(true)}
              variant="secondary"
              className="h-8 w-8 rounded-full"
            >
              <span>
                <Camera className="h-4 w-4" />
              </span>
            </Button>
          </label>
        </section>
        {isModalOpen && (
          <section className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
              <h2 className="text-lg font-semibold">Atualizar foto</h2>

              <ProviderPhotoUpload
                value={currentLogo && getPublicUrl("providers-logos", currentLogo)}
                onChange={setNewLogo}
              />

              <div className="flex gap-2">
                <Button className="h-10" onClick={handleSaveAvatar} disabled={!newLogo || isSaving}>
                  {isSaving ? "Salvando..." : "Salvar"}
                </Button>

                <Button className="h-10" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </section>
        )}
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
            className="h-10"
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/providers")}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>

          <Button className="h-10" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : isEditing ? "Salvar alterações" : "Salvar provedor"}
          </Button>
        </div>
      </form>
    </section>
  );
}
