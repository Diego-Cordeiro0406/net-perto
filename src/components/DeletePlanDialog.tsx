import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

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

import { useDeletePlan } from "@/hooks/usePlans";

import type { Database } from "@/integrations/supabase/types";

type Plan = Database["public"]["Tables"]["plans"]["Row"];

type DeletePlanDialogProps = {
  plan: Plan;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeletePlanDialog({ plan, open, onOpenChange }: DeletePlanDialogProps) {
  const deletePlan = useDeletePlan();

  const handleDelete = async () => {
    try {
      await deletePlan.mutateAsync({ id: plan.id, providerId: plan.provider_id });

      toast.add({
        title: "Plano excluído",
        description: `O plano "${plan.name}" foi excluído com sucesso.`,
        type: "success",
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao excluir plano:", error);

      toast.add({
        title: "Erro ao excluir plano",
        description: error instanceof Error ? error.message : "Não foi possível excluir o plano.",
        type: "error",
      });
    }
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(value) => {
        if (!deletePlan.isPending) {
          onOpenChange(value);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir plano?</AlertDialogTitle>

          <AlertDialogDescription>
            Você tem certeza que deseja excluir o plano <strong>{plan.name}</strong>?
            <br />
            <br />
            Esta ação não poderá ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={deletePlan.isPending}>Cancelar</AlertDialogCancel>

          <AlertDialogAction
            render={<Button variant="destructive" disabled={deletePlan.isPending} />}
            onClick={(event) => {
              event.preventDefault();
              handleDelete();
            }}
          >
            {deletePlan.isPending ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
