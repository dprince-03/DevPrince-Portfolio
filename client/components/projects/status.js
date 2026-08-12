// Shared status → color/label mapping (folder grid + badge + anywhere else
// a project's status needs to render). Matches the palette convention:
// blue = in progress, green = complete, red = not started.
export const STATUS_CONFIG = {
  NOT_STARTED: { label: "not started", text: "text-term-red", border: "border-term-red/40", bg: "bg-term-red/10" },
  IN_PROGRESS: { label: "in progress", text: "text-term-blue", border: "border-term-blue/40", bg: "bg-term-blue/10" },
  COMPLETE: { label: "complete", text: "text-term-green", border: "border-term-green/40", bg: "bg-term-green/10" },
};

export function statusConfig(status) {
  return STATUS_CONFIG[status] ?? STATUS_CONFIG.NOT_STARTED;
}
