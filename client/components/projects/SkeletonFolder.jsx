export default function SkeletonFolder() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-term-border bg-term-panel p-5">
      <div className="h-9 w-9 animate-pulse rounded bg-term-border/80" />
      <div className="space-y-2">
        <div className="h-3 w-2/3 animate-pulse rounded bg-term-border/80" />
        <div className="h-3 w-full animate-pulse rounded bg-term-border/60" />
      </div>
      <div className="flex gap-1.5">
        <div className="h-4 w-12 animate-pulse rounded bg-term-border/50" />
        <div className="h-4 w-16 animate-pulse rounded bg-term-border/50" />
      </div>
    </div>
  );
}
