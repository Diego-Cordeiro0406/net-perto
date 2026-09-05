import { useState } from "react";
import { ArrowLeft, Pencil, Plus, Trash2, Wifi } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useProvider } from "@/hooks/useProviders";
import { useProviderCoverage } from "@/hooks/useProviderCoverage";

import { ProviderCoverageDialog } from "@/components/ProviderCoverageDialog";
import { DeleteProviderCoverageDialog } from "@/components/DeleteProviderCoverageDialog";

import { COVERAGE_STATUS } from "@/lib/constants";

import type { Database } from "@/integrations/supabase/types";

type ProviderCoverage = Database["public"]["Tables"]["provider_coverage"]["Row"];

type ProviderCoverageWithNeighborhood = ProviderCoverage & {
  neighborhoods: {
    id: string;
    name: string;
  } | null;
};

export default function ProviderCoverage() {
  const { id } = useParams();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCoverage, setSelectedCoverage] = useState<ProviderCoverageWithNeighborhood | null>(
    null
  );

  const [coverageToDelete, setCoverageToDelete] = useState<ProviderCoverageWithNeighborhood | null>(
    null
  );

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: provider, isLoading: isLoadingProvider, error: providerError } = useProvider(id);

  const {
    data: coverage = [],
    isLoading: isLoadingCoverage,
    error: coverageError,
  } = useProviderCoverage(id);

  if (isLoadingProvider) {
    return <p>Carregando provedor...</p>;
  }

  if (providerError || !provider) {
    return <p className="text-destructive">Não foi possível carregar o provedor.</p>;
  }

  return (
    <section className="mx-auto w-full max-w-5xl space-y-6">
      <div>
        <Button variant="ghost">
          <Link className="flex items-center" to="/admin/providers">
            <ArrowLeft className="mr-1" />
            Voltar para provedores
          </Link>
        </Button>
      </div>

      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Cobertura</h1>

          <p className="text-sm text-muted-foreground">
            Gerencie os bairros atendidos por <strong>{provider.name}</strong>.
          </p>
        </div>

        <Button
          onClick={() => {
            setSelectedCoverage(null);
            setIsDialogOpen(true);
          }}
          className="h-10"
        >
          <Plus />
          Adicionar cobertura
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Bairros atendidos</CardTitle>
        </CardHeader>

        <CardContent>
          {isLoadingCoverage && (
            <p className="text-sm text-muted-foreground">Carregando coberturas...</p>
          )}

          {coverageError && (
            <p className="text-sm text-destructive">Não foi possível carregar as coberturas.</p>
          )}

          {!isLoadingCoverage && !coverageError && coverage.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Wifi className="mb-3 size-8 text-muted-foreground" />

              <p className="font-medium">Nenhuma cobertura cadastrada</p>

              <p className="text-sm text-muted-foreground">
                Adicione os bairros atendidos por este provedor.
              </p>
            </div>
          )}

          {coverage.length > 0 && (
            <div className="space-y-3">
              {coverage.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium">
                      {item.neighborhoods?.name ?? "Bairro não encontrado"}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Status: {COVERAGE_STATUS[item.status]}
                    </p>
                  </div>

                  <section className="flex items-center">
                    <Button
                      className="mr-2"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedCoverage(item);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Pencil />
                      Editar
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCoverageToDelete(item);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 />
                      Excluir
                    </Button>
                  </section>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ProviderCoverageDialog
        providerId={provider.id}
        coverage={selectedCoverage}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />

      <DeleteProviderCoverageDialog
        coverage={coverageToDelete}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </section>
  );
}
