import { Pencil, Trash2, Wifi } from "lucide-react";

import type { Database } from "@/integrations/supabase/types";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatters";

type Plan = Database["public"]["Tables"]["plans"]["Row"];

type PlanCardProps = {
  plan: Plan;
  onEdit: (plan: Plan) => void;
  onDelete: (plan: Plan) => void;
};

export function PlanCard({ plan, onEdit, onDelete }: PlanCardProps) {
  const benefits = Array.isArray(plan.benefits) ? plan.benefits : [];

  return (
    <div className="flex flex-col rounded-lg border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold">{plan.name}</h2>

          {plan.description && (
            <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
          )}
        </div>

        <span
          className={
            plan.is_active
              ? "rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-600"
              : "rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground"
          }
        >
          {plan.is_active ? "Ativo" : "Inativo"}
        </span>
      </div>

      <div className="mt-5">
        {plan.promotional_price !== null ? (
          <>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{formatCurrency(plan.promotional_price)}</span>

              {plan.promotional_months && (
                <span className="text-sm text-muted-foreground">
                  por {plan.promotional_months} {plan.promotional_months === 1 ? "mês" : "meses"}
                </span>
              )}
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Depois, {formatCurrency(plan.price)}/mês
            </p>
          </>
        ) : (
          <>
            <p className="text-2xl font-bold">{formatCurrency(plan.price)}</p>

            <p className="text-sm text-muted-foreground">por mês</p>
          </>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <div className="rounded-md bg-muted px-3 py-2 text-sm">↓ {plan.download_speed} Mbps</div>

        <div className="rounded-md bg-muted px-3 py-2 text-sm">↑ {plan.upload_speed} Mbps</div>

        {plan.wifi_type && (
          <div className="rounded-md bg-muted px-3 py-2 text-sm flex items-center">
            <Wifi className="size-4 text-muted-foreground mr-2" /> {plan.wifi_type}
          </div>
        )}

        {plan.contract_months !== null && (
          <div className="rounded-md bg-muted px-3 py-2 text-sm">
            Fidelidade: {plan.contract_months} {plan.contract_months === 1 ? "mês" : "meses"}
          </div>
        )}

        {plan.installation_fee !== null && (
          <div className="rounded-md bg-muted px-3 py-2 text-sm">
            Instalação:{" "}
            {`${plan.installation_fee === 0 ? "Gratis" : formatCurrency(plan.installation_fee)}`}
          </div>
        )}
      </div>

      {benefits.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-sm font-medium">Benefícios</p>

          <ul className="space-y-1 text-sm text-muted-foreground">
            {benefits.map((benefit, index) => {
              if (typeof benefit !== "object" || benefit === null || !("name" in benefit)) {
                return null;
              }

              return <li key={index}>• {String(benefit.name)}</li>;
            })}
          </ul>
        </div>
      )}

      <div className="mt-auto flex justify-end gap-2 pt-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onEdit(plan)}
          aria-label={`Editar ${plan.name}`}
        >
          <Pencil />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => onDelete(plan)}
          aria-label={`Excluir ${plan.name}`}
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  );
}
