"use client";

import { useEffect, useState } from "react";
import { settingsApi, skillsApi } from "@/lib/api";
import TechIcon from "@/components/icons/TechIcon";

const STACK_ROWS = [
  { category: "LANGUAGE", label: "languages" },
  { category: "FRAMEWORK", label: "frameworks & libraries" },
  { category: "DATABASE", label: "databases" },
  { category: "INFRA", label: "infrastructure & devops" },
  { category: "TOOL", label: "tools" },
];

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
  const byCategory = (skills || []).reduce((acc, skill) => {
    (acc[skill.category] ||= []).push(skill);
    return acc;
  }, {});

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-2xl border border-term-border bg-term-panel/80 backdrop-blur-md ${className}`}
    >
      <div className="flex shrink-0 items-center gap-2 border-b border-term-border bg-term-bg/60 px-5 py-3.5">
        <span className="h-2.5 w-2.5 rounded-full bg-term-red" />
        <span className="h-2.5 w-2.5 rounded-full bg-term-gold" />
        <span className="h-2.5 w-2.5 rounded-full bg-term-green" />
        <span className="flex-1 text-center text-xs text-term-silver-dim">zsh &mdash; portfolio</span>
      </div>

      <div className="flex flex-1 flex-col p-8">
        <p className="text-sm text-term-green">
          you<span className="text-term-blue">@</span>portfolio
          <span className="text-term-silver-dim">:</span>
          <span className="text-term-blue">~</span>
          <span className="text-term-silver-dim">$</span> neofetch
        </p>

        {s.short_bio && (
          <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-term-silver">{s.short_bio}</p>
        )}

        <div className="mt-6 space-y-4">
          {STACK_ROWS.map(({ category, label }) => {
            const items = byCategory[category];
            if (!items?.length) return null;
            return (
              <div key={category}>
                <p className="text-[11px] font-bold uppercase tracking-widest text-term-silver-dim">{label}</p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                  {items.map((skill) => (
                    <span key={skill.id} className="flex items-center gap-1.5 text-sm text-term-white">
                      <TechIcon name={skill.name} className="h-4 w-4 shrink-0 text-term-blue" />
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 border-t border-term-border pt-4">
          <p className="text-[11px] font-bold uppercase tracking-widest text-term-silver-dim">status</p>
          <p className="mt-1 text-sm text-term-green">{s.now_status || "available for work"}</p>
        </div>
      </div>
    </div>
  );
}
