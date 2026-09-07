import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatCurrency, formatSpeed } from "@/lib/formatters";
import { RecentActivitySkeleton } from "../skeletons/RecentActivitySkeleton";

type RecentProvider = {
  id: string;
  name: string;
  website: string | null;
  created_at: string;
};

type RecentPlan = {
  id: string;
  name: string;
  price: number | null;
  download_speed: number | null;
  upload_speed: number | null;
  created_at: string;
  provider_id: string;
  providers: {
    id: string;
    name: string;
  } | null;
};

type RecentActivityProps = {
  recentProviders?: RecentProvider[];
  recentPlans?: RecentPlan[];
  isLoading: boolean;
};

function EmptyState({ message, action }: { message: string; action?: React.ReactNode }) {
  return (
    <div className="flex min-h-32 flex-col items-center justify-center gap-3 px-6 py-8 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>

      {action}
    </div>
  );
}

export function RecentActivity({ recentProviders, recentPlans, isLoading }: RecentActivityProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Atividade recente</h2>

        <p className="text-sm text-muted-foreground">Últimos registros adicionados à plataforma.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Provedores recentes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle>Provedores recentes</CardTitle>

                <p className="mt-1 text-sm text-muted-foreground">
                  Últimos provedores adicionados.
                </p>
              </div>

              <Link
                to="/admin/providers"
                className="text-sm font-medium text-primary hover:underline"
              >
                Ver todos
              </Link>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {isLoading ? (
              <RecentActivitySkeleton />
            ) : recentProviders?.length ? (
              <div className="divide-y">
                {recentProviders.map((provider) => (
                  <div
                    key={provider.id}
                    className="flex items-center justify-between gap-4 px-6 py-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{provider.name}</p>

                      {provider.website ? (
                        <a
                          href={provider.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 flex items-center gap-1 truncate text-xs text-muted-foreground hover:text-foreground"
                        >
                          <span className="truncate">{provider.website}</span>

                          <ExternalLink className="size-3 shrink-0" />
                        </a>
                      ) : (
                        <p className="mt-1 text-xs text-muted-foreground">Website não informado</p>
                      )}
                    </div>

                    <time
                      dateTime={provider.created_at}
                      className="shrink-0 text-xs text-muted-foreground"
                    >
                      {formatDate(provider.created_at)}
                    </time>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                message="Nenhum provedor foi cadastrado ainda."
                action={
                  <Link
                    to="/admin/providers/new"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Adicionar provedor
                  </Link>
                }
              />
            )}
          </CardContent>
        </Card>

        {/* Planos recentes */}
        <Card>
          <CardHeader>
            <CardTitle>Planos recentes</CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">Últimos planos adicionados.</p>
          </CardHeader>

          <CardContent className="p-0">
            {isLoading ? (
              <RecentActivitySkeleton />
            ) : recentPlans?.length ? (
              <div className="divide-y">
                {recentPlans.map((plan) => (
                  <div key={plan.id} className="flex items-center justify-between gap-4 px-6 py-4">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{plan.name}</p>

                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {plan.providers?.name ?? "Provedor não encontrado"}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-medium">
                        {plan.price && formatCurrency(plan.price)}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatSpeed(plan.download_speed)}

                        {plan.upload_speed !== null && ` ↓ ${formatSpeed(plan.upload_speed)}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message="Nenhum plano foi cadastrado ainda." />
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
