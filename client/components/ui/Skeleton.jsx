export function SkeletonLine({ className = "" }) {
  return (
    <div
      className={`h-3 animate-pulse rounded bg-term-border/80 ${className}`}
    />
  );
}

export function SkeletonTerminalCard({ title = "loading..." }) {
  return (
    <div className="overflow-hidden rounded-xl border border-term-border bg-term-panel">
      <div className="flex items-center gap-2 border-b border-term-border px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-term-red/40" />
        <span className="h-3 w-3 rounded-full bg-term-gold/40" />
        <span className="h-3 w-3 rounded-full bg-term-green/40" />
        <span className="ml-3 text-sm text-term-silver-dim">{title}</span>
      </div>
      <div className="space-y-3 p-6">
        <SkeletonLine className="w-2/5" />
        <SkeletonLine className="w-4/5" />
        <SkeletonLine className="w-3/5" />
        <SkeletonLine className="w-1/3" />
      </div>
    </div>
  );
}
