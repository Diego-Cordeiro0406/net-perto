import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useDeleteProviderCoverage } from "@/hooks/useProviderCoverage";
import { toast } from "@/components/ui/toast";
import type { ProviderCoverageWithNeighborhood } from "@/hooks/useNeighborhoods";

type DeleteProviderCoverageDialogProps = {
  coverage: ProviderCoverageWithNeighborhood | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteProviderCoverageDialog({
  coverage,
  open,
  onOpenChange,
}: DeleteProviderCoverageDialogProps) {
  const deleteCoverage = useDeleteProviderCoverage();

  const handleDelete = async () => {
    if (!coverage) return;

    try {
      await deleteCoverage.mutateAsync({
        id: coverage.id,
        providerId: coverage.provider_id,
      });

      toast.add({
        title: "Cobertura excluída",
        description: `A cobertura do bairro ${coverage.neighborhoods?.name ?? "-"} foi removida com sucesso.`,
        type: "success",
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao excluir cobertura:", error);

      toast.add({
        title: "Erro ao excluir cobertura",
        description:
          error instanceof Error ? error.message : "Não foi possível excluir a cobertura.",
        type: "error",
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir cobertura?</AlertDialogTitle>

          <AlertDialogDescription>
            Você tem certeza que deseja remover a cobertura do bairro{" "}
            <strong>{coverage?.neighborhoods?.name ?? "-"}</strong>?
            <br />
            <br />
            Essa ação não poderá ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteCoverage.isPending}>Cancelar</AlertDialogCancel>

          <AlertDialogAction onClick={handleDelete} disabled={deleteCoverage.isPending}>
            {deleteCoverage.isPending ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
