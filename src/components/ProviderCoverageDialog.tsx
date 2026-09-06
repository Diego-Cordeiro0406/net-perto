import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { providerCoverageSchema, type ProviderCoverageFormData } from "@/lib/validators";

import { useCreateProviderCoverage, useUpdateProviderCoverage } from "@/hooks/useProviderCoverage";

import { useNeighborhoods } from "@/hooks/useNeighborhoods";

import type { Database } from "@/integrations/supabase/types";
import { toast } from "./ui/toast";
import { Input } from "./ui/input";
import { NeighborhoodCombobox } from "./NeighborhoodCombobox";

type ProviderCoverage = Database["public"]["Tables"]["provider_coverage"]["Row"];

type ProviderCoverageDialogProps = {
  providerId: string;
  coverage?: ProviderCoverage | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ProviderCoverageDialog({
  providerId,
  coverage,
  open,
  onOpenChange,
}: ProviderCoverageDialogProps) {
  const isEditing = Boolean(coverage);

  const createCoverage = useCreateProviderCoverage();
  const updateCoverage = useUpdateProviderCoverage();

  const { isLoading: isLoadingNeighborhoods } = useNeighborhoods();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<ProviderCoverageFormData>({
    resolver: zodResolver(providerCoverageSchema),
    defaultValues: {
      neighborhood_id: "",
      status: "available",
      source: "",
      last_checked_at: undefined,
    },
  });

  const status = useWatch({
    control,
    name: "status",
  });

  const neighborhoodId = useWatch({
    control,
    name: "neighborhood_id",
  });

  useEffect(() => {
    if (coverage) {
      reset({
        neighborhood_id: coverage.neighborhood_id,
        status: coverage.status,
        source: coverage.source ?? "",
        last_checked_at: coverage.last_checked_at ?? undefined,
      });
    } else {
      reset({
        neighborhood_id: "",
        status: "available",
        source: "",
        last_checked_at: undefined,
      });
    }
  }, [coverage, open, reset]);

  const onSubmit = async (data: ProviderCoverageFormData) => {
    try {
      if (isEditing && coverage) {
        await updateCoverage.mutateAsync({
          id: coverage.id,
          data: {
            neighborhood_id: data.neighborhood_id,
            status: data.status,
            source: data.source,
            last_checked_at: data.last_checked_at || null,
          },
        });
      } else {
        await createCoverage.mutateAsync({
          provider_id: providerId,
          neighborhood_id: data.neighborhood_id,
          status: data.status,
          source: data.source,
          last_checked_at: data.last_checked_at || null,
        });
      }

      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao salvar cobertura:", error);

      toast.add({
        title: "Erro ao salvar cobertura",
        description:
          error instanceof Error ? error.message : "Não foi possível salvar a cobertura.",
        type: "error",
      });
    }
  };

  const isSubmitting = createCoverage.isPending || updateCoverage.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar cobertura" : "Adicionar cobertura"}</DialogTitle>

          <DialogDescription>
            {isEditing
              ? "Atualize as informações da cobertura."
              : "Informe o bairro atendido pelo provedor."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="neighborhood_id">Bairro</Label>

            <NeighborhoodCombobox
              value={neighborhoodId}
              onValueChange={(value) => {
                setValue("neighborhood_id", value, {
                  shouldValidate: true,
                });
              }}
              disabled={isSubmitting}
            />

            {errors.neighborhood_id && (
              <p className="text-sm text-destructive">{errors.neighborhood_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>

            <Select
              value={status}
              onValueChange={(value) => {
                if (value) {
                  setValue("status", value, {
                    shouldValidate: true,
                  });
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="available">Atendido</SelectItem>

                <SelectItem value="unavailable">Não atendido</SelectItem>

                <SelectItem value="unknown">Não confirmado</SelectItem>
              </SelectContent>
            </Select>

            {errors.status && <p className="text-sm text-destructive">{errors.status.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="source">Fonte</Label>

            <Input id="source" placeholder="Site oficial" {...register("source")} />

            {errors.source && <p className="text-sm text-destructive">{errors.source.message}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              className="h-10"
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>

            <Button
              className="h-10"
              type="submit"
              disabled={isSubmitting || isLoadingNeighborhoods}
            >
              {isSubmitting
                ? "Salvando..."
                : isEditing
                  ? "Salvar alterações"
                  : "Adicionar cobertura"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
