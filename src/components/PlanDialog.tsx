import { useEffect } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

import { toast } from "@/components/ui/toast";

import { useCreatePlan, useUpdatePlan } from "@/hooks/usePlans";

import { planSchema, type PlanFormData } from "@/lib/validators";

import type { Database } from "@/integrations/supabase/types";

type Plan = Database["public"]["Tables"]["plans"]["Row"];

type PlanDialogProps = {
  providerId: string;
  plan?: Plan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function PlanDialog({ providerId, plan, open, onOpenChange }: PlanDialogProps) {
  const isEditing = Boolean(plan);

  const createPlan = useCreatePlan();
  const updatePlan = useUpdatePlan();

  const isPending = createPlan.isPending || updatePlan.isPending;

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<z.input<typeof planSchema>, unknown, z.output<typeof planSchema>>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: "",
      description: "",
      price: undefined,
      promotional_price: undefined,
      promotional_months: undefined,
      download_speed: undefined,
      upload_speed: undefined,
      benefits: [],
      installation_fee: undefined,
      contract_months: undefined,
      source_url: "",
      is_active: true,
      wifi_type: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "benefits",
  });

  const isActive = useWatch({
    control,
    name: "is_active",
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    if (plan) {
      const benefits = Array.isArray(plan.benefits)
        ? plan.benefits.filter(
            (benefit): benefit is { name: string } =>
              typeof benefit === "object" &&
              benefit !== null &&
              "name" in benefit &&
              typeof benefit.name === "string"
          )
        : [];

      reset({
        name: plan.name,
        description: plan.description ?? "",
        price: plan.price,
        promotional_price: plan.promotional_price ?? undefined,
        promotional_months: plan.promotional_months ?? undefined,
        download_speed: plan.download_speed,
        upload_speed: plan.upload_speed,
        benefits,
        installation_fee: plan.installation_fee ?? undefined,
        contract_months: plan.contract_months ?? undefined,
        source_url: plan.source_url ?? "",
        is_active: plan.is_active,
        wifi_type: plan.wifi_type ?? "",
      });
    } else {
      reset({
        name: "",
        description: "",
        price: undefined,
        promotional_price: undefined,
        promotional_months: undefined,
        download_speed: undefined,
        upload_speed: undefined,
        benefits: [],
        installation_fee: undefined,
        contract_months: undefined,
        source_url: "",
        is_active: true,
        wifi_type: "",
      });
    }
  }, [open, plan, reset]);

  const onSubmit = async (values: PlanFormData) => {
    try {
      const data = {
        name: values.name,
        description: values.description || null,

        price: values.price,

        promotional_price: values.promotional_price ?? null,

        promotional_months: values.promotional_months ?? null,

        download_speed: values.download_speed,
        upload_speed: values.upload_speed,

        benefits: values.benefits,

        installation_fee: values.installation_fee ?? null,

        contract_months: values.contract_months ?? null,

        source_url: values.source_url || "",

        is_active: values.is_active,

        wifi_type: values.wifi_type || null,
      };

      if (isEditing && plan) {
        await updatePlan.mutateAsync({
          id: plan.id,
          providerId,
          data,
        });

        toast.add({
          title: "Plano atualizado",
          description: "O plano foi atualizado com sucesso.",
          type: "success",
        });
      } else {
        await createPlan.mutateAsync({
          provider_id: providerId,
          ...data,
        });

        toast.add({
          title: "Plano criado",
          description: "O plano foi criado com sucesso.",
          type: "success",
        });
      }

      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao salvar plano:", error);

      toast.add({
        title: "Erro ao salvar plano",
        description: error instanceof Error ? error.message : "Não foi possível salvar o plano.",
        type: "error",
      });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!isPending) {
          onOpenChange(value);
        }
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar plano" : "Adicionar plano"}</DialogTitle>

          <DialogDescription>
            {isEditing
              ? "Atualize as informações do plano."
              : "Cadastre um novo plano para este provedor."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Informações básicas */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium">Informações básicas</h3>

              <p className="text-sm text-muted-foreground">Informações gerais sobre o plano.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nome do plano</Label>

              <Input id="name" placeholder="Ex.: Fibra 500 Mega" {...register("name")} />

              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>

              <Textarea
                id="description"
                placeholder="Descrição opcional do plano"
                {...register("description")}
              />

              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Preços */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium">Preços</h3>

              <p className="text-sm text-muted-foreground">
                Informe o preço normal e, caso exista, a promoção.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="price">Preço mensal</Label>

                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="99,90"
                  {...register("price")}
                />

                {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="promotional_price">Preço promocional</Label>

                <Input
                  id="promotional_price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="79,90"
                  {...register("promotional_price")}
                />

                {errors.promotional_price && (
                  <p className="text-sm text-destructive">{errors.promotional_price.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="promotional_months">Meses da promoção</Label>

                <Input
                  id="promotional_months"
                  type="number"
                  min="1"
                  placeholder="3"
                  {...register("promotional_months")}
                />

                {errors.promotional_months && (
                  <p className="text-sm text-destructive">{errors.promotional_months.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Velocidade */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium">Velocidade</h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="download_speed">Download (Mbps)</Label>

                <Input
                  id="download_speed"
                  type="number"
                  min="1"
                  placeholder="500"
                  {...register("download_speed")}
                />

                {errors.download_speed && (
                  <p className="text-sm text-destructive">{errors.download_speed.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="upload_speed">Upload (Mbps)</Label>

                <Input
                  id="upload_speed"
                  type="number"
                  min="1"
                  placeholder="250"
                  {...register("upload_speed")}
                />

                {errors.upload_speed && (
                  <p className="text-sm text-destructive">{errors.upload_speed.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="download_speed">Tipo de Wi-fi</Label>

                <Input
                  id="wifi_type"
                  type="string"
                  min="1"
                  placeholder="Wi-fi 5"
                  {...register("wifi_type")}
                />

                {errors.wifi_type && (
                  <p className="text-sm text-destructive">{errors.wifi_type.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Condições */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium">Condições</h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="installation_fee">Taxa de instalação</Label>

                <Input
                  id="installation_fee"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  {...register("installation_fee")}
                />

                {errors.installation_fee && (
                  <p className="text-sm text-destructive">{errors.installation_fee.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contract_months">Fidelidade (meses)</Label>

                <Input
                  id="contract_months"
                  type="number"
                  min="1"
                  placeholder="12"
                  {...register("contract_months")}
                />

                {errors.contract_months && (
                  <p className="text-sm text-destructive">{errors.contract_months.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label htmlFor="is_active">Plano ativo</Label>

                <p className="text-sm text-muted-foreground">
                  Planos inativos não serão exibidos nas buscas públicas.
                </p>
              </div>

              <Switch
                id="is_active"
                checked={isActive}
                onCheckedChange={(checked: boolean) =>
                  setValue("is_active", checked, {
                    shouldValidate: true,
                  })
                }
              />
            </div>
          </div>

          {/* Benefícios */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-medium">Benefícios</h3>

                <p className="text-sm text-muted-foreground">
                  Serviços e vantagens incluídos no plano.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ name: "" })}
              >
                <Plus />
                Adicionar
              </Button>
            </div>

            {fields.length === 0 && (
              <div className="rounded-lg border border-dashed p-6 text-center">
                <p className="text-sm text-muted-foreground">Nenhum benefício adicionado.</p>
              </div>
            )}

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <div className="flex-1">
                    <Input placeholder="Ex.: Netflix" {...register(`benefits.${index}.name`)} />

                    {errors.benefits?.[index]?.name && (
                      <p className="mt-1 text-sm text-destructive">
                        {errors.benefits[index]?.name?.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => remove(index)}
                    aria-label="Remover benefício"
                  >
                    <Trash2 />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Fonte */}
          <div className="space-y-2">
            <Label htmlFor="source_url">Fonte do plano</Label>

            <Input
              id="source_url"
              type="url"
              placeholder="https://..."
              {...register("source_url")}
            />

            {errors.source_url && (
              <p className="text-sm text-destructive">{errors.source_url.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              className="h-10"
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>

            <Button className="h-10" type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : isEditing ? "Salvar alterações" : "Adicionar plano"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
