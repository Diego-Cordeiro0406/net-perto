export function RecentActivitySkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="divide-y">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center justify-between gap-4 px-6 py-4">
          <div className="space-y-2">
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />

            <div className="h-3 w-24 animate-pulse rounded bg-muted" />
          </div>

          <div className="h-3 w-20 animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}
