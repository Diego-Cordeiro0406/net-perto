import { Skeleton } from "@/components/ui/skeleton";

import { PlanResultCardSkeleton } from "./PlanResultCardSkeleton";

export function ProviderResultSectionSkeleton() {
  return (
    <section className="space-y-6">
      {/* Provider header */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-md" />

        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />

          <Skeleton className="h-4 w-48" />
        </div>
      </div>

      {/* Plans */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <PlanResultCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}
