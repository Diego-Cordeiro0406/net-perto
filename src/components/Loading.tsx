import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

type LoadingProps = {
  message?: string;
  className?: string;
};

export function Loading({ message = "Carregando...", className }: LoadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground",
        className
      )}
    >
      <LoaderCircle className="h-6 w-6 animate-spin" />

      {message && <p className="text-sm">{message}</p>}
    </div>
  );
}
