const STATUS_STYLES = {
  NOT_STARTED: {
    border: "border-term-red",
    glow: "group-hover:[filter:drop-shadow(0_0_14px_#ff5555)_drop-shadow(0_0_28px_#ff555566)_drop-shadow(0_16px_20px_rgba(0,0,0,0.5))]",
  },
  IN_PROGRESS: {
    border: "border-term-blue",
    glow: "group-hover:[filter:drop-shadow(0_0_14px_#4a9eff)_drop-shadow(0_0_28px_#4a9eff66)_drop-shadow(0_16px_20px_rgba(0,0,0,0.5))]",
  },
  COMPLETE: {
    border: "border-term-green",
    glow: "group-hover:[filter:drop-shadow(0_0_14px_#4ade80)_drop-shadow(0_0_28px_#4ade8066)_drop-shadow(0_16px_20px_rgba(0,0,0,0.5))]",
  },
};

export default function FolderTile({ status = "NOT_STARTED", className = "" }) {
  const cfg = STATUS_STYLES[status] ?? STATUS_STYLES.NOT_STARTED;

  return (
    <div
      className={`relative h-[135px] w-[168px] shrink-0 transition-transform duration-300 group-hover:-translate-y-2 ${cfg.glow} ${className}`}
    >
      <div className={`absolute left-1.5 top-2.5 h-5 w-16 rounded-t-lg border-2 border-b-0 bg-term-bg ${cfg.border}`} />
      <div
        className={`absolute inset-x-0 bottom-0 top-6 rounded-bl-2xl rounded-br-2xl rounded-tl-sm rounded-tr-2xl border-2 bg-term-bg ${cfg.border}`}
      />
    </div>
  );
}
