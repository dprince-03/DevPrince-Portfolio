// Horizontal magnitude bars — single hue (sequential job: "how much", not
// identity), direct-labeled since the dataset is small (top-N lists), so the
// value is always reachable without relying on hover.
export default function BarChart({ data, colorClass = "bg-term-blue", emptyLabel = "No data yet" }) {
  if (!data || data.length === 0) {
    return <p className="text-sm text-term-silver-dim">{emptyLabel}</p>;
  }

  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div className="space-y-3">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="w-32 shrink-0 truncate text-xs text-term-silver" title={d.label}>
            {d.label}
          </span>
          {/* Track is fully rounded (empty channel, not a mark); the fill is
              square at the baseline and rounded only at the data-end. */}
          <div className="h-4 flex-1 overflow-hidden rounded bg-term-border/30">
            <div
              className={`h-full rounded-r ${colorClass}`}
              style={{ width: `${Math.max(4, (d.value / max) * 100)}%` }}
            />
          </div>
          <span className="w-8 shrink-0 text-right text-xs text-term-silver-dim">{d.value}</span>
        </div>
      ))}
    </div>
  );
}
