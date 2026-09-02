import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

import type { Database } from "@/integrations/supabase/types";
import { toast } from "./ui/toast";
import { fetchAddress } from "@/hooks/useFetchAddress";

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

  const [isFetchingAddress, setIsFetchingAddress] = useState(false);

  const createCoverage = useCreateProviderCoverage();
  const updateCoverage = useUpdateProviderCoverage();

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
      zip_code: "",
      street: "",
      neighborhood: "",
      status: "available",
      source: "",
    },
  });

  const status = useWatch({
    control,
    name: "status",
  });

  const zipCode = useWatch({
    control,
    name: "zip_code",
  });

  useEffect(() => {
    const cleanCep = zipCode?.replace(/\D/g, "");

    if (cleanCep?.length !== 8) {
      return;
    }

    const loadAddress = async () => {
      try {
        setIsFetchingAddress(true);

        const address = await fetchAddress(cleanCep);

        setValue("street", address.street);
        setValue("neighborhood", address.neighborhood);
      } catch (error) {
        console.error("Erro ao buscar endereço:", error);

        setValue("street", "");
        setValue("neighborhood", "");

        toast.add({
          title: "Erro ao buscar CEP",
          description: "Não foi possível obter os dados desse CEP.",
          type: "error",
        });
      } finally {
        setIsFetchingAddress(false);
      }
    };

    loadAddress();
  }, [zipCode, setValue]);

  useEffect(() => {
    if (coverage) {
      reset({
        zip_code: coverage.zip_code,
        status: coverage.status,
        source: coverage.source,
        last_checked_at: coverage.last_checked_at ?? undefined,
      });
    } else {
      reset({
        zip_code: "",
        status: "available",
        source: "",
        last_checked_at: undefined,
      });
    }
  }, [coverage, open, reset]);

  const onSubmit = async (data: ProviderCoverageFormData) => {
    try {
      const formattedZipCode = data.zip_code.replace(/\D/g, "");

      if (isEditing && coverage) {
        await updateCoverage.mutateAsync({
          id: coverage.id,
          data: {
            zip_code: formattedZipCode,
            street: data.street,
            neighborhood: data.neighborhood,
            status: data.status,
            source: data.source,
            last_checked_at: data.last_checked_at || null,
          },
        });
      } else {
        await createCoverage.mutateAsync({
          provider_id: providerId,
          zip_code: formattedZipCode,
          street: data.street,
          neighborhood: data.neighborhood,
          status: data.status,
          source: data.source,
          last_checked_at: data.last_checked_at || null,
        });
      }

      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao salvar cobertura:", error);
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
              : "Informe um CEP atendido pelo provedor."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="zip_code">CEP</Label>

            <Input id="zip_code" placeholder="56302-000" {...register("zip_code")} />

            {errors.zip_code && (
              <p className="text-sm text-destructive">{errors.zip_code.message}</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="street">Logradouro</Label>

              <Input
                id="street"
                readOnly
                placeholder={isFetchingAddress ? "Buscando endereço..." : "Informe o CEP"}
                {...register("street")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="neighborhood">Bairro</Label>

              <Input
                id="neighborhood"
                readOnly
                placeholder={isFetchingAddress ? "Buscando endereço..." : "Informe o CEP"}
                {...register("neighborhood")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>

            <Select
              id="status"
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

            <Button className="h-10" type="submit" disabled={isSubmitting}>
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
