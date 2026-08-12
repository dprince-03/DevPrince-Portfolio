"use client";

export default function StatusBar({ rainEnabled, onToggleRain }) {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-20 flex h-7 items-center justify-between border-t border-term-border bg-term-panel px-4 text-[11px] text-term-silver-dim">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5 text-term-green">
          <span className="h-2 w-2 rounded-full bg-term-green" /> online
        </span>
        <span>⎇ main</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="hidden sm:inline">UTF-8</span>
        <span className="hidden sm:inline">JetBrains Mono</span>
        <button
          type="button"
          onClick={onToggleRain}
          className="transition-colors hover:text-term-green"
          title="Toggle matrix-rain background"
        >
          rain: {rainEnabled ? "on" : "off"}
        </button>
      </div>
    </footer>
  );
}
