"use client";

import { useEffect, useState } from "react";
import MatrixRain from "@/components/effects/MatrixRain";
import CursorTrail from "@/components/effects/CursorTrail";
import StatusBar from "@/components/layout/StatusBar";
import SocialFooter from "@/components/layout/SocialFooter";
import CookieConsent, { CONSENT_KEY } from "@/components/layout/CookieConsent";
import PageviewTracker from "@/components/layout/PageviewTracker";

const STORAGE_KEY = "matrix-rain-enabled";

export default function SiteChrome() {
  const [rainEnabled, setRainEnabled] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [consentGranted, setConsentGranted] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    setReducedMotion(prefersReducedMotion);
    setRainEnabled(stored !== null ? stored === "true" : !prefersReducedMotion);
    setConsentGranted(window.localStorage.getItem(CONSENT_KEY) === "granted");
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, String(rainEnabled));
  }, [rainEnabled, ready]);

  if (!ready) return null;

  return (
    <>
      <MatrixRain enabled={rainEnabled} />
      {!reducedMotion && <CursorTrail />}
      <PageviewTracker consentGranted={consentGranted} />
      <CookieConsent onChange={setConsentGranted} />
      <SocialFooter />
      <StatusBar rainEnabled={rainEnabled} onToggleRain={() => setRainEnabled((e) => !e)} />
    </>
  );
}
