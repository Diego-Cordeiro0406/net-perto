import { Skeleton } from "@/components/ui/skeleton";

import { ProviderResultSectionSkeleton } from "./ProviderResultSectionSkeleton";

export function SearchResultsSkeleton() {
  return (
    <div className="space-y-10">
      {/* Summary */}
      <div className="space-y-2">
        <Skeleton className="h-7 w-72" />

        <Skeleton className="h-4 w-48" />
      </div>

      {/* Sorting */}
      <Skeleton className="h-10 w-48" />

      {/* Providers */}
      <div className="space-y-12">
        <ProviderResultSectionSkeleton />

        <ProviderResultSectionSkeleton />
      </div>
    </div>
  );
}
