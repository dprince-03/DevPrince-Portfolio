"use client";

import { useEffect, useState } from "react";
import TerminalWindow from "@/components/terminal/TerminalWindow";
import { githubApi } from "@/lib/api";

const LEVEL_CLASSES = ["bg-term-border/40", "bg-term-blue/25", "bg-term-blue/45", "bg-term-blue/70", "bg-term-blue"];

function levelFor(count, max) {
  if (count === 0 || max === 0) return 0;
  const ratio = count / max;
  if (ratio > 0.75) return 4;
  if (ratio > 0.5) return 3;
  if (ratio > 0.25) return 2;
  return 1;
}

export default function GithubContributions({ className = "" }) {
  const [data, setData] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    githubApi
      .contributions()
      .then((res) => !cancelled && setData(res))
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, []);

  if (failed || !data) return null;

  const max = Math.max(0, ...data.weeks.flatMap((w) => w.contributionDays.map((d) => d.contributionCount)));

  return (
    <TerminalWindow title="contributions.svg" animate={false} className={className}>
      <div className="flex items-baseline gap-8">
        <div>
          <p className="text-2xl font-semibold text-term-green">{data.totalContributions}</p>
          <p className="text-[10px] uppercase tracking-widest text-term-silver-dim">contributions (past year)</p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-term-gold">{data.currentStreak}</p>
          <p className="text-[10px] uppercase tracking-widest text-term-silver-dim">day streak</p>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto pb-1">
        <div className="grid grid-flow-col gap-[3px]" style={{ gridTemplateRows: "repeat(7, 10px)" }}>
          {data.weeks.map((week) =>
            week.contributionDays.map((day) => (
              <div
                key={day.date}
                title={`${day.contributionCount} on ${day.date}`}
                className={`h-[10px] w-[10px] rounded-[2px] ${LEVEL_CLASSES[levelFor(day.contributionCount, max)]}`}
              />
            ))
          )}
        </div>
      </div>
    </TerminalWindow>
  );
}
