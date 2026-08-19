"use client";

import { useEffect, useState } from "react";
import TerminalWindow from "@/components/terminal/TerminalWindow";
import { settingsApi } from "@/lib/api";

function describe(event) {
  const repo = event.repo?.name?.split("/")[1] || event.repo?.name;
  switch (event.type) {
    case "PushEvent": {
      const count = event.payload?.commits?.length || 1;
      return `pushed ${count} commit${count === 1 ? "" : "s"} to ${repo}`;
    }
    case "PullRequestEvent":
      if (event.payload?.action !== "opened") return null;
      return `opened a pull request in ${repo}`;
    case "IssuesEvent":
      if (event.payload?.action !== "opened") return null;
      return `opened an issue in ${repo}`;
    case "CreateEvent":
      if (event.payload?.ref_type !== "repository") return null;
      return `created ${repo}`;
    case "WatchEvent":
      return `starred ${repo}`;
    case "ForkEvent":
      return `forked ${repo}`;
    default:
      return null;
  }
}

function timeAgo(iso) {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 3600) return `${Math.max(1, Math.floor(seconds / 60))}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function GithubActivity({ className = "" }) {
  const [username, setUsername] = useState(null);
  const [items, setItems] = useState(null);

  useEffect(() => {
    let cancelled = false;
    settingsApi
      .list()
      .then((settings) => {
        if (cancelled || !settings.github_username) return;
        setUsername(settings.github_username);
        return fetch(`https://api.github.com/users/${settings.github_username}/events/public?per_page=30`)
          .then((res) => (res.ok ? res.json() : null))
          .then((events) => {
            if (cancelled || !events) return;
            const described = events
              .map((e) => ({ id: e.id, text: describe(e), when: timeAgo(e.created_at) }))
              .filter((e) => e.text)
              .slice(0, 7);
            setItems(described);
          });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!username || !items || items.length === 0) return null;

  return (
    <TerminalWindow title="activity.log" animate={false} className={className}>
      <p className="text-term-silver-dim">
        <span className="text-term-green">$</span> tail -f activity.log
      </p>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-baseline justify-between gap-4 text-sm">
            <p className="text-term-white">
              <span className="text-term-blue">@{username}</span> {item.text}
            </p>
            <span className="shrink-0 text-xs text-term-silver-dim">{item.when}</span>
          </div>
        ))}
      </div>
    </TerminalWindow>
  );
}
