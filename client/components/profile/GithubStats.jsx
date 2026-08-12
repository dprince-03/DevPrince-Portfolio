"use client";

import { useEffect, useState } from "react";
import TerminalWindow from "@/components/terminal/TerminalWindow";
import { settingsApi } from "@/lib/api";

export default function GithubStats() {
  const [stats, setStats] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    let cancelled = false;
    settingsApi
      .list()
      .then((settings) => {
        if (cancelled || !settings.github_username) return;
        setUsername(settings.github_username);
        // Unauthenticated GitHub REST API — public data only, no token needed.
        // Rate-limited to 60 req/hr/IP, which is fine at portfolio-site scale.
        return fetch(`https://api.github.com/users/${settings.github_username}`)
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => !cancelled && data && setStats(data));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!username || !stats) return null;

  return (
    <TerminalWindow title="github.json" animate={false}>
      <div className="flex items-center gap-4">
        {stats.avatar_url && (
          // eslint-disable-next-line @next/next/no-img-element -- external GitHub avatar, not a local asset
          <img src={stats.avatar_url} alt="" className="h-12 w-12 rounded-full ring-2 ring-term-border" />
        )}
        <div className="flex gap-6 text-sm">
          <div>
            <p className="text-term-gold">{stats.public_repos}</p>
            <p className="text-[10px] uppercase tracking-widest text-term-silver-dim">repos</p>
          </div>
          <div>
            <p className="text-term-blue">{stats.followers}</p>
            <p className="text-[10px] uppercase tracking-widest text-term-silver-dim">followers</p>
          </div>
          <div>
            <p className="text-term-green">{stats.following}</p>
            <p className="text-[10px] uppercase tracking-widest text-term-silver-dim">following</p>
          </div>
        </div>
        <a
          href={stats.html_url}
          target="_blank"
          rel="noreferrer"
          className="ml-auto text-xs text-term-silver hover:text-term-gold hover:underline"
        >
          @{username} →
        </a>
      </div>
    </TerminalWindow>
  );
}
