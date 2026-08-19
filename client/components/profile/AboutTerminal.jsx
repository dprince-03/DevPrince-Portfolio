"use client";

import { useEffect, useState } from "react";
import TerminalWindow from "@/components/terminal/TerminalWindow";
import { settingsApi } from "@/lib/api";

export default function AboutTerminal({ className = "" }) {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    let cancelled = false;
    settingsApi
      .list()
      .then((data) => !cancelled && setSettings(data))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const s = settings || {};
  const bio = s.about_bio || "Write a few paragraphs about yourself here — editable from the admin dashboard.";
  const interests = s.about_interests
    ? s.about_interests.split(",").map((i) => i.trim()).filter(Boolean)
    : [];

  return (
    <TerminalWindow title="about.md" className={className}>
      <p className="text-term-silver-dim">
        <span className="text-term-green">$</span> cat about.md
      </p>
      <div className="mt-5 space-y-4 whitespace-pre-line text-sm leading-relaxed text-term-white">{bio}</div>

      {interests.length > 0 && (
        <div className="mt-6 border-t border-term-border pt-5">
          <p className="text-xs uppercase tracking-widest text-term-silver-dim">{"// interests"}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {interests.map((interest) => (
              <span
                key={interest}
                className="rounded-full border border-term-border bg-term-bg px-3 py-1 text-xs font-semibold text-term-white"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}
    </TerminalWindow>
  );
}
