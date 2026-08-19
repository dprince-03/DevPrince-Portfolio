export default function StatTile({ label, value, accent = "text-term-white" }) {
  return (
    <div className="rounded-xl border border-term-border bg-term-panel/80 p-4 backdrop-blur-md">
      <p className="text-xs uppercase tracking-widest text-term-silver-dim">{label}</p>
      <p className={`mt-2 text-3xl font-semibold ${accent}`}>{value}</p>
    </div>
  );
}
