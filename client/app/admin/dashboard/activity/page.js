"use client";

import { useEffect, useState } from "react";
import { activityApi, API_URL } from "@/lib/api";
import AdminSection from "@/components/admin/AdminSection";
import Button from "@/components/admin/Button";
import { SkeletonTerminalCard } from "@/components/ui/Skeleton";

export default function ActivityPage() {
  const [logs, setLogs] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    activityApi.list().then(setLogs).catch((err) => setError(err.message));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-widest text-term-silver-dim">$ tail -f activity.log</p>
        <a href={`${API_URL}/api/export`} target="_blank" rel="noreferrer">
          <Button variant="ghost">export site as JSON</Button>
        </a>
      </div>

      {error && <p className="text-sm text-term-red">error: {error}</p>}
      {!logs && !error && <SkeletonTerminalCard title="activity.log" />}

      {logs && (
        <AdminSection title="activity.log">
          {logs.length === 0 ? (
            <p className="text-sm text-term-silver-dim">No activity recorded yet.</p>
          ) : (
            <div className="space-y-2 font-mono text-xs">
              {logs.map((log) => (
                <div key={log.id} className="flex gap-3 border-b border-term-border/50 pb-2">
                  <span className="shrink-0 text-term-silver-dim">
                    {new Date(log.createdAt).toISOString().replace("T", " ").slice(0, 19)}
                  </span>
                  <span className="shrink-0 text-term-blue">{log.action}</span>
                  <span className="truncate text-term-silver">{log.detail}</span>
                </div>
              ))}
            </div>
          )}
        </AdminSection>
      )}
    </div>
  );
}
