"use client";

import { useEffect, useState } from "react";
import { analyticsApi, projectsApi, messagesApi } from "@/lib/api";
import AdminSection from "@/components/admin/AdminSection";
import StatTile from "@/components/charts/StatTile";
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";
import { SkeletonTerminalCard } from "@/components/ui/Skeleton";

function last30DaysSeries(byDay) {
  const days = [];
  for (let i = 29; i >= 0; i -= 1) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({ date: key, value: byDay?.[key] || 0 });
  }
  return days;
}

export default function DashboardOverviewPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    Promise.all([analyticsApi.summary(), projectsApi.list(), messagesApi.list()])
      .then(([analytics, projects, messages]) => {
        if (cancelled) return;
        setData({
          analytics,
          projectCount: projects.length,
          unreadCount: messages.filter((m) => !m.read).length,
        });
      })
      .catch((err) => !cancelled && setError(err.message));
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return <p className="text-sm text-term-red">error: {error}</p>;
  }

  if (!data) {
    return (
      <div className="grid gap-6 sm:grid-cols-2">
        <SkeletonTerminalCard title="stats.json" />
        <SkeletonTerminalCard title="visits.json" />
      </div>
    );
  }

  const { analytics, projectCount, unreadCount } = data;
  const series = last30DaysSeries(analytics.last30Days.byDay);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="total visits" value={analytics.totalVisits} />
        <StatTile label="unique visitors (30d)" value={analytics.last30Days.uniqueVisitors} accent="text-term-blue" />
        <StatTile
          label="unread messages"
          value={unreadCount}
          accent={unreadCount > 0 ? "text-term-gold" : "text-term-white"}
        />
        <StatTile label="projects" value={projectCount} accent="text-term-green" />
      </div>

      <AdminSection title="visits.json — last 30 days">
        <LineChart points={series} />
      </AdminSection>

      <div className="grid gap-6 sm:grid-cols-2">
        <AdminSection title="top-pages.json">
          <BarChart data={analytics.topPaths.map((p) => ({ label: p.path, value: p.count }))} colorClass="bg-term-blue" />
        </AdminSection>
        <AdminSection title="top-referrers.json">
          <BarChart
            data={analytics.topReferrers.map((r) => ({ label: r.referrer, value: r.count }))}
            colorClass="bg-term-gold"
            emptyLabel="No referrer data yet"
          />
        </AdminSection>
      </div>
    </div>
  );
}
