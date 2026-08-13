"use client";

import { useEffect, useState } from "react";
import { settingsApi } from "@/lib/api";

export default function NowBadge() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    let cancelled = false;
    settingsApi
      .list()
      .then((settings) => !cancelled && setStatus(settings.now_status || null))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!status) return null;

  return (
    <p className="text-xs text-term-silver">
      <span className="mr-2 inline-block h-2 w-2 rounded-full bg-term-green align-middle" />
      now: <span className="text-term-white">{status}</span>
    </p>
  );
}
