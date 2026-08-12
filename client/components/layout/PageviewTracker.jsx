"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { analyticsApi } from "@/lib/api";
import { CONSENT_KEY } from "@/components/layout/CookieConsent";

export default function PageviewTracker({ consentGranted }) {
  const pathname = usePathname();

  useEffect(() => {
    const consent = consentGranted ?? window.localStorage.getItem(CONSENT_KEY) === "granted";
    if (!consent) return;
    analyticsApi.pageview(pathname, document.referrer || null).catch(() => {});
    // Re-fires on pathname change (normal navigation) and when consentGranted
    // flips to true (banner just accepted) — both are intentional triggers.
  }, [pathname, consentGranted]);

  return null;
}
