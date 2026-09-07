export function CoverageByProviderSkeleton() {
  return (
    <div className="space-y-5">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="h-4 w-32 animate-pulse rounded bg-muted" />

              <div className="h-3 w-20 animate-pulse rounded bg-muted" />
            </div>

            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
          </div>

          <div className="h-2 w-full animate-pulse rounded-full bg-muted" />
        </div>
      ))}
    </div>
  );
}
