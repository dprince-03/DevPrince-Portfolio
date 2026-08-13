import { statusConfig } from "./status";

export default function StatusBadge({ status }) {
  const cfg = statusConfig(status);
  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-xs ${cfg.text} ${cfg.border} ${cfg.bg}`}>
      {cfg.label}
    </span>
  );
}
