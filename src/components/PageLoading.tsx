import { LoaderCircle } from "lucide-react";

type PageLoadingProps = {
  message?: string;
};

export function PageLoading({ message = "Carregando..." }: PageLoadingProps) {
  return (
    <div className="flex min-h-100 flex-col items-center justify-center gap-3">
      <LoaderCircle className="h-8 w-8 animate-spin text-muted-foreground" />

      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
