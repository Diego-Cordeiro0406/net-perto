import { Card, CardContent } from "@/components/ui/card";
import { useDashboard } from "@/hooks/useDashboard";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { CoverageSummary } from "@/components/dashboard/CoverageSummary";
import { CoverageByProvider } from "@/components/dashboard/CoverageByProvider";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

export default function Dashboard() {
  const { data, isLoading, isError } = useDashboard();

  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>

          <p className="text-muted-foreground">Visão geral da plataforma NetPerto.</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">
              Não foi possível carregar os dados do dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <section className="space-y-8">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>

        <p className="text-muted-foreground">Visão geral da plataforma NetPerto.</p>
      </div>

      <DashboardStats stats={data?.stats} isLoading={isLoading} />

      <CoverageSummary summary={data?.coverageSummary} isLoading={isLoading} />

      <CoverageByProvider providers={data?.coverageByProvider} isLoading={isLoading} />

      <RecentActivity
        recentProviders={data?.recentProviders}
        recentPlans={data?.recentPlans}
        isLoading={isLoading}
      />
    </section>
  );
}
