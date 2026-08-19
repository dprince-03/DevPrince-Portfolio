"use client";

import { useEffect, useState } from "react";
import TerminalWindow from "@/components/terminal/TerminalWindow";
import BarChart from "@/components/charts/BarChart";
import { settingsApi } from "@/lib/api";

export default function GithubRepoStats({ className = "" }) {
  const [username, setUsername] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let cancelled = false;
    settingsApi
      .list()
      .then((settings) => {
        if (cancelled || !settings.github_username) return;
        setUsername(settings.github_username);
        return fetch(`https://api.github.com/users/${settings.github_username}/repos?per_page=100&sort=updated`)
          .then((res) => (res.ok ? res.json() : null))
          .then((repos) => {
            if (cancelled || !repos) return;

            const owned = repos.filter((r) => !r.fork);
            const totalStars = owned.reduce((sum, r) => sum + r.stargazers_count, 0);
            const totalForks = owned.reduce((sum, r) => sum + r.forks_count, 0);

            const langCounts = {};
            owned.forEach((r) => {
              if (r.language) langCounts[r.language] = (langCounts[r.language] || 0) + 1;
            });
            const languages = Object.entries(langCounts)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([label, value]) => ({ label, value }));

            const topRepos = [...owned].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 4);

            setStats({ totalStars, totalForks, repoCount: owned.length, languages, topRepos });
          });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!username || !stats) return null;

  return (
    <TerminalWindow title="repos.json" animate={false} className={className}>
      <div className="flex gap-8">
        <div>
          <p className="text-2xl font-semibold text-term-gold">{stats.totalStars}</p>
          <p className="text-[10px] uppercase tracking-widest text-term-silver-dim">stars</p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-term-blue">{stats.totalForks}</p>
          <p className="text-[10px] uppercase tracking-widest text-term-silver-dim">forks</p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-term-green">{stats.repoCount}</p>
          <p className="text-[10px] uppercase tracking-widest text-term-silver-dim">public repos</p>
        </div>
      </div>

      {stats.languages.length > 0 && (
        <div className="mt-6 border-t border-term-border pt-5">
          <p className="text-xs uppercase tracking-widest text-term-silver-dim">{"// top languages"}</p>
          <div className="mt-3">
            <BarChart data={stats.languages} colorClass="bg-term-blue" />
          </div>
        </div>
      )}

      {stats.topRepos.length > 0 && (
        <div className="mt-6 border-t border-term-border pt-5">
          <p className="text-xs uppercase tracking-widest text-term-silver-dim">{"// top repos"}</p>
          <div className="mt-3 space-y-3">
            {stats.topRepos.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                className="block rounded-lg border border-term-border p-3 transition-colors hover:border-term-blue"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-term-white">{repo.name}</span>
                  <span className="flex shrink-0 items-center gap-1 text-xs text-term-gold">
                    &#9733; {repo.stargazers_count}
                  </span>
                </div>
                {repo.description && (
                  <p className="mt-1 truncate text-xs text-term-silver-dim">{repo.description}</p>
                )}
              </a>
            ))}
          </div>
        </div>
      )}
    </TerminalWindow>
  );
}
