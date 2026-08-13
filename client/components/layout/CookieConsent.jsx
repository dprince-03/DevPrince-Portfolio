"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export const CONSENT_KEY = "analytics-consent";

export default function CookieConsent({ onChange }) {
  const [choice, setChoice] = useState(undefined); // undefined = not decided yet whether to show

  useEffect(() => {
    setChoice(window.localStorage.getItem(CONSENT_KEY));
  }, []);

  function decide(value) {
    window.localStorage.setItem(CONSENT_KEY, value);
    setChoice(value);
    onChange?.(value === "granted");
  }

  if (choice === undefined || choice === "granted" || choice === "denied") return null;

  return (
    // bottom-16 (64px) = StatusBar (28px) + SocialFooter (36px) stacked below it
    <div className="fixed inset-x-0 bottom-16 z-20 border-t border-term-border bg-term-panel px-4 py-3 text-xs text-term-silver">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
        <p>
          This site logs anonymous page visits (no ads, no tracking cookies sold to anyone) to see what's
          getting read.{" "}
          <Link href="/privacy" className="text-term-blue hover:underline">
            details
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => decide("denied")}
            className="rounded-md border border-term-border px-3 py-1.5 text-term-silver hover:border-term-red hover:text-term-red"
          >
            decline
          </button>
          <button
            type="button"
            onClick={() => decide("granted")}
            className="rounded-md bg-term-blue/90 px-3 py-1.5 font-semibold text-term-bg hover:bg-term-blue"
          >
            accept
          </button>
        </div>
      </div>
    </div>
  );
}
