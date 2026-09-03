import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { ArrowLeft, Plus, Wifi } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useProvider } from "@/hooks/useProviders";
import { usePlans } from "@/hooks/usePlans";
import { PlanCard } from "@/components/PlanCard";
import type { Database } from "@/integrations/supabase/types";
import { PlanDialog } from "@/components/PlanDialog";
import { DeletePlanDialog } from "@/components/DeletePlanDialog";

type Plan = Database["public"]["Tables"]["plans"]["Row"];

export default function AdminPlans() {
  const { providerId } = useParams();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [planToDelete, setPlanToDelete] = useState<Plan | null>(null);

  const { data: provider, isLoading: isLoadingProvider } = useProvider(providerId);

  const { data: plans, isLoading: isLoadingPlans, error } = usePlans(providerId ?? "");

  const handleCreatePlan = () => {
    setSelectedPlan(null);
    setIsDialogOpen(true);
  };

  if (isLoadingProvider) {
    return (
      <div className="flex h-40 items-center justify-center">
        <p className="text-sm text-muted-foreground">Carregando provedor...</p>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">Provedor não encontrado.</p>

        <Button variant="outline">
          <Link to="/admin/providers">
            <ArrowLeft />
            Voltar
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Button variant="ghost" size="sm" className="mb-2">
            <Link className="flex items-center" to="/admin/providers">
              <ArrowLeft className="mr-1" />
              Voltar para provedores
            </Link>
          </Button>

          <h1 className="text-2xl font-semibold">Planos</h1>

          <p className="text-sm text-muted-foreground">
            Gerencie os planos disponíveis da <strong>{provider.name}</strong>.
          </p>
        </div>

        <Button className="h-10" onClick={handleCreatePlan}>
          <Plus />
          Adicionar plano
        </Button>
      </div>

      {isLoadingPlans && (
        <div className="flex h-40 items-center justify-center">
          <p className="text-sm text-muted-foreground">Carregando planos...</p>
        </div>
      )}

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error.message}
        </div>
      )}

      {!isLoadingPlans && !error && plans?.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
          <Wifi className="mb-4 size-10 text-muted-foreground" />

          <h2 className="font-medium">Nenhum plano cadastrado</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Adicione o primeiro plano deste provedor.
          </p>
        </div>
      )}

      {!isLoadingPlans && plans && plans.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onEdit={(plan) => {
                setSelectedPlan(plan);
                setIsDialogOpen(true);
              }}
              onDelete={() => {
                setPlanToDelete(plan);
              }}
            />
          ))}
        </div>
      )}

      <PlanDialog
        providerId={provider.id}
        plan={selectedPlan}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />

      {planToDelete && (
        <DeletePlanDialog
          plan={planToDelete}
          open={Boolean(planToDelete)}
          onOpenChange={(open) => {
            if (!open) {
              setPlanToDelete(null);
            }
          }}
        />
      )}
    </section>
  );
}
