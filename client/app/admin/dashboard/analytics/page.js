"use client";

import { useEffect, useState } from "react";
import { analyticsApi } from "@/lib/api";
import AdminSection from "@/components/admin/AdminSection";
import BarChart from "@/components/charts/BarChart";
import LineChart from "@/components/charts/LineChart";
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

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    analyticsApi
      .summary()
      .then((data) => !cancelled && setAnalytics(data))
      .catch((err) => !cancelled && setError(err.message));
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) return <p className="text-sm text-term-red">error: {error}</p>;
  if (!analytics) return <SkeletonTerminalCard title="analytics.json" />;

  return (
    <div className="space-y-8">
      <p className="text-xs uppercase tracking-widest text-term-silver-dim">$ cat analytics.json</p>

      <AdminSection title="visits.json — last 30 days">
        <LineChart points={last30DaysSeries(analytics.last30Days.byDay)} />
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

      <AdminSection title="countries.json">
        <BarChart
          data={analytics.countries.map((c) => ({ label: c.country, value: c.count }))}
          colorClass="bg-term-green"
          emptyLabel="No geo data yet — visits from private/local IPs don't resolve to a country"
        />
      </AdminSection>
    </div>
  );
}
