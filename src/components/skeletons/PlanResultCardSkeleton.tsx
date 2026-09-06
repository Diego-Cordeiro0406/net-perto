import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

export function PlanResultCardSkeleton() {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="space-y-4">
        {/* Provider */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-md" />

          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />

            <Skeleton className="h-3 w-20" />
          </div>
        </div>

        {/* Plan */}
        <div className="space-y-2">
          <Skeleton className="h-7 w-32" />

          <Skeleton className="h-4 w-full" />
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-6">
        {/* Speed */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border p-3">
            <Skeleton className="h-3 w-16" />

            <Skeleton className="mt-3 h-6 w-20" />
          </div>

          <div className="rounded-lg border p-3">
            <Skeleton className="h-3 w-16" />

            <Skeleton className="mt-3 h-6 w-20" />
          </div>
        </div>

        {/* Price */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />

          <Skeleton className="h-9 w-32" />
        </div>

        {/* Benefits */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-36" />

          <Skeleton className="h-4 w-full" />

          <Skeleton className="h-4 w-4/5" />

          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* Additional information */}
        <div className="space-y-3 border-t pt-4">
          <Skeleton className="h-4 w-32" />

          <Skeleton className="h-4 w-40" />
        </div>
      </CardContent>

      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}
