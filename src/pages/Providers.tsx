import { MoreHorizontal, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useDeleteProvider, useProviders } from "@/hooks/useProviders";
import { toast } from "@/components/ui/toast";

export default function Providers() {
  const navigate = useNavigate();

  const { data: providers = [], isLoading, error } = useProviders();
  const deleteProvider = useDeleteProvider();

  async function handleDelete(id: string) {
    await deleteProvider.mutateAsync(id);
    toast.add({
      title: "Provedor exluido com sucesso!",
    });
  }

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Provedores</h1>

          <p className="text-sm text-muted-foreground">
            Gerencie os provedores cadastrados no NetPerto.
          </p>
        </div>

        <Button className="h-10" onClick={() => navigate("/admin/providers/new")}>
          <Plus />
          Novo provedor
        </Button>
      </header>

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          Não foi possível carregar os provedores.
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Website</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Cobertura</TableHead>
              <TableHead className="w-16 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Carregando provedores...
                </TableCell>
              </TableRow>
            ) : providers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Nenhum provedor cadastrado.
                </TableCell>
              </TableRow>
            ) : (
              providers.map((provider) => (
                <TableRow key={provider.id}>
                  <TableCell className="font-medium">{provider.name}</TableCell>

                  <TableCell>
                    <a
                      href={provider.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {provider.website}
                    </a>
                  </TableCell>

                  <TableCell className="max-w-xs truncate">
                    {provider.description || "Sem descrição"}
                  </TableCell>
                  <TableCell className="max-w-md truncate">{provider.coverageCount}</TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <span aria-label={`Ações para ${provider.name}`}>
                          <MoreHorizontal className="h-5 w-5 pr-1" />
                        </span>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => navigate(`/admin/providers/${provider.id}/edit`)}
                        >
                          Editar
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => navigate(`/admin/providers/${provider.id}/coverage`)}
                        >
                          Cobertura
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => navigate(`/admin/providers/${provider.id}/plans`)}
                        >
                          Planos
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => handleDelete(provider.id)}>
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
