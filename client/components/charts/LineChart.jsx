// Single-series trend line + ~10% wash area, one hue. Visible dot + direct
// label only at the endpoint (the "current value" story); every other point
// stays reachable via a native tooltip on an invisible, generously-sized hit
// target rather than flooding the chart with a label per point.
export default function LineChart({ points, className = "" }) {
  if (!points || points.length === 0) {
    return <p className="text-sm text-term-silver-dim">No data yet</p>;
  }

  const width = 600;
  const height = 160;
  const pad = 10;
  const max = Math.max(1, ...points.map((p) => p.value));
  const stepX = points.length > 1 ? (width - pad * 2) / (points.length - 1) : 0;

  const coords = points.map((p, i) => ({
    ...p,
    x: pad + i * stepX,
    y: height - pad - (p.value / max) * (height - pad * 2),
  }));

  const linePath = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(" ");
  const last = coords[coords.length - 1];
  const areaPath = `${linePath} L ${last.x.toFixed(1)} ${height - pad} L ${coords[0].x.toFixed(1)} ${height - pad} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={`w-full ${className}`} preserveAspectRatio="none">
      <line
        x1={pad}
        y1={height - pad}
        x2={width - pad}
        y2={height - pad}
        stroke="currentColor"
        className="text-term-border"
        strokeWidth="1"
      />
      <path d={areaPath} className="fill-term-blue/10" stroke="none" />
      <path d={linePath} className="stroke-term-blue" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />
      {coords.map((c) => (
        <circle key={c.date} cx={c.x} cy={c.y} r="8" fill="transparent">
          <title>{`${c.date}: ${c.value}`}</title>
        </circle>
      ))}
      <circle cx={last.x} cy={last.y} r="4" className="fill-term-blue" />
      <text
        x={Math.max(pad, last.x - 24)}
        y={Math.max(12, last.y - 8)}
        className="fill-term-white text-[10px]"
      >
        {last.value}
      </text>
    </svg>
  );
}
