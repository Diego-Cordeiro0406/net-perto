import { ArrowDown, ArrowUp, Check, ExternalLink, Info, Wifi } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import type { PlanResultCardProps } from "@/types/types";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export function PlanResultCard({ plan }: PlanResultCardProps) {
  const promotionalPrice =
    plan.promotional_price !== null ? formatCurrency(plan.promotional_price) : null;
  const hasPromotion = plan.promotional_price !== null && plan.promotional_months !== null;

  const installationIsFree = plan.installation_fee === 0;

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="space-y-4">
        {/* Provider */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-connectivity/10">
            <Wifi className="h-5 w-5 text-connectivity" />
          </div>

          <div className="min-w-0">
            <p className="truncate font-medium">{plan.provider?.name ?? "Provedor"}</p>

            {plan.wifi_type && <p className="text-sm text-muted-foreground">{plan.wifi_type}</p>}
          </div>
        </div>

        {/* Plan */}
        <div>
          <h2 className="text-2xl font-bold">{plan.name}</h2>

          {plan.description && (
            <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-6">
        {/* Speed */}
        <div className="grid lg:grid-cols-2 gap-3 grid-cols-1">
          <div className="rounded-lg border border-connectivity/15 bg-connectivity/5 p-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ArrowDown className="h-4 w-4 text-connectivity" />

              <span className="text-xs">Download</span>
            </div>

            <p className="mt-2 text-lg font-semibold">{plan.download_speed} Mbps</p>
          </div>

          <div className="rounded-lg border border-connectivity/15 bg-connectivity/5 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <ArrowUp className="h-4 w-4 text-connectivity" />

                <span className="text-xs">Upload</span>
              </div>

              <Popover>
                <PopoverTrigger
                  render={
                    <button
                      type="button"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                      aria-label="Informações sobre a velocidade de upload"
                    />
                  }
                >
                  <Info className="h-4 w-4" />
                </PopoverTrigger>

                <PopoverContent className="w-72 text-sm">
                  A velocidade de upload pode variar. Este valor pode não ser exato devido à
                  disponibilidade limitada de informações do provedor.
                </PopoverContent>
              </Popover>
            </div>

            <p className="mt-2 text-lg font-semibold">{plan.upload_speed} Mbps</p>
          </div>
        </div>

        {/* Price */}
        <div>
          {hasPromotion && promotionalPrice ? (
            <>
              <div className="mb-2 inline-flex items-center rounded-full border border-promotion/30 bg-promotion/10 px-2.5 py-1 text-xs font-medium text-promotion-foreground">
                Oferta promocional
              </div>
              <p className="text-sm text-muted-foreground">A partir de</p>

              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">{promotionalPrice}</span>

                <span className="mb-1 text-sm text-muted-foreground">/mês</span>
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                por {plan.promotional_months} {plan.promotional_months === 1 ? "mês" : "meses"}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Depois, {formatCurrency(plan.price)}/mês
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">Mensalidade</p>

              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">{formatCurrency(plan.price)}</span>

                <span className="mb-1 text-sm text-muted-foreground">/mês</span>
              </div>
            </>
          )}
        </div>

        {/* Benefits */}
        {plan.benefits.length > 0 && (
          <div>
            <p className="mb-3 text-sm font-medium">Benefícios incluídos</p>

            <ul className="space-y-2">
              {plan.benefits.map((benefit, index) => (
                <li key={`${benefit.name}-${index}`} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 shrink-0 text-success" />

                  <span>{benefit.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Additional information */}
        <div className="space-y-2 border-t pt-4 text-sm text-muted-foreground">
          {installationIsFree && (
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-success" />

              <span>Instalação grátis</span>
            </div>
          )}

          {plan.installation_fee !== null && plan.installation_fee > 0 && (
            <div>
              Instalação:{" "}
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(plan.installation_fee)}
            </div>
          )}

          {plan.contract_months !== null && (
            <div>
              Fidelidade de {plan.contract_months} {plan.contract_months === 1 ? "mês" : "meses"}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button
          nativeButton={false}
          className="w-full h-10"
          render={<a href={plan.source_url} target="_blank" rel="noopener noreferrer" />}
        >
          Ver oferta
          <ExternalLink />
        </Button>
      </CardFooter>
    </Card>
  );
}
