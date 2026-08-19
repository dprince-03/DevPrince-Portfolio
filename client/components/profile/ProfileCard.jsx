"use client";

import { useEffect, useState } from "react";
import { settingsApi } from "@/lib/api";
import {
  GithubIcon,
  LinkedinIcon,
  XIcon,
  WhatsappIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  CheckIcon,
} from "@/components/icons/SocialIcons";

const ROWS = [
  { key: "social_email", label: "Email", Icon: MailIcon, fallback: "you@example.com" },
  { key: "phone", label: "Phone", Icon: PhoneIcon, fallback: "" },
  { key: "location", label: "Location", Icon: PinIcon, fallback: "" },
  { key: "availability", label: "Available", Icon: CheckIcon, fallback: "" },
];

export default function ProfileCard({ className = "" }) {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    let cancelled = false;
    settingsApi
      .list()
      .then((data) => !cancelled && setSettings(data))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const s = settings || {};

  return (
    <div
      className={`flex flex-col items-center rounded-2xl border border-term-border bg-term-panel/80 p-8 backdrop-blur-md ${className}`}
    >
      {s.profile_photo_url ? (
        // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded, arbitrary origin
        <img
          src={s.profile_photo_url}
          alt=""
          className="h-36 w-36 flex-shrink-0 rounded-full object-cover shadow-[0_16px_40px_rgba(74,158,255,0.2)]"
        />
      ) : (
        <div className="h-36 w-36 flex-shrink-0 rounded-full bg-gradient-to-br from-term-blue to-term-green/60 shadow-[0_16px_40px_rgba(74,158,255,0.2)]" />
      )}

      <p className="mt-5 text-xl font-extrabold text-term-white">{s.profile_name || "Your Name"}</p>

      <p className="mt-2.5 rounded-full bg-term-bg px-4 py-1.5 text-center text-xs font-bold text-term-blue">
        {s.tagline || "Full-Stack Developer"}
      </p>

      <div className="my-6 h-px w-full bg-term-border" />

      <div className="flex w-full flex-col gap-5">
        {ROWS.map(({ key, label, Icon, fallback }) => {
          const value = s[key] || fallback;
          if (!value) return null;
          return (
            <div key={key} className="flex items-center gap-3.5">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-term-blue/15 text-term-blue">
                <Icon />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-term-silver-dim">{label}</p>
                <p className="mt-0.5 text-sm font-semibold text-term-white">{value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-7 flex gap-2.5">
        {s.social_github && (
          <a
            href={s.social_github}
            target="_blank"
            rel="noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-term-blue/15 text-term-blue transition-colors hover:bg-term-blue/25"
          >
            <GithubIcon />
          </a>
        )}
        {s.social_linkedin && (
          <a
            href={s.social_linkedin}
            target="_blank"
            rel="noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-term-blue/15 text-term-blue transition-colors hover:bg-term-blue/25"
          >
            <LinkedinIcon />
          </a>
        )}
        {s.social_x && (
          <a
            href={s.social_x}
            target="_blank"
            rel="noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-term-blue/15 text-term-blue transition-colors hover:bg-term-blue/25"
          >
            <XIcon />
          </a>
        )}
        {s.social_whatsapp && (
          <a
            href={`https://wa.me/${s.social_whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-term-blue/15 text-term-blue transition-colors hover:bg-term-blue/25"
          >
            <WhatsappIcon />
          </a>
        )}
      </div>
    </div>
  );
}
