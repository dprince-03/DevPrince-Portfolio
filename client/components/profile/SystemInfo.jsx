"use client";

import { useEffect, useState } from "react";
import { settingsApi, skillsApi } from "@/lib/api";

export default function SystemInfo({ className = "" }) {
  const [settings, setSettings] = useState(null);
  const [skills, setSkills] = useState(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([settingsApi.list(), skillsApi.list()])
      .then(([settingsData, skillsData]) => {
        if (cancelled) return;
        setSettings(settingsData);
        setSkills(skillsData);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const s = settings || {};
  const stack = skills?.length ? skills.slice(0, 4).map((skill) => skill.name).join(" · ") : "—";

  return (
    <div className={`flex flex-col overflow-hidden rounded-2xl border border-term-border bg-term-panel/80 backdrop-blur-md ${className}`}>
      <div className="flex shrink-0 items-center gap-2 border-b border-term-border bg-term-bg/60 px-5 py-3.5">
        <span className="h-2.5 w-2.5 rounded-full bg-term-red" />
        <span className="h-2.5 w-2.5 rounded-full bg-term-gold" />
        <span className="h-2.5 w-2.5 rounded-full bg-term-green" />
        <span className="flex-1 text-center text-xs text-term-silver-dim">zsh &mdash; portfolio</span>
      </div>

      <div className="flex flex-1 flex-col p-8">
        <p className="mb-4 text-sm text-term-green">
          you<span className="text-term-blue">@</span>portfolio
          <span className="text-term-silver-dim">:</span>
          <span className="text-term-blue">~</span>
          <span className="text-term-silver-dim">$</span> neofetch
        </p>

        <div className="grid grid-cols-[110px_1fr] gap-y-2.5 text-base">
          <span className="font-bold text-term-gold">Stack</span>
          <span className="text-term-white">{stack}</span>
          <span className="font-bold text-term-green">Uptime</span>
          <span className="text-term-white">{s.uptime_text || "shipping since day one"}</span>
          <span className="font-bold text-term-blue">Status</span>
          <span className="text-term-green">{s.now_status || "available for work"}</span>
        </div>

        <div className="mt-6 flex gap-1.5">
          <span className="h-5 w-5 rounded bg-term-red" />
          <span className="h-5 w-5 rounded bg-term-gold" />
          <span className="h-5 w-5 rounded bg-term-green" />
          <span className="h-5 w-5 rounded bg-term-blue" />
          <span className="h-5 w-5 rounded bg-term-silver" />
          <span className="h-5 w-5 rounded bg-term-white" />
        </div>
      </div>
    </div>
  );
}
