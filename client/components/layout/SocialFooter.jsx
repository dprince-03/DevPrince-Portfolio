"use client";

import { useEffect, useState } from "react";
import { WhatsappIcon, XIcon, LinkedinIcon, GithubIcon } from "@/components/icons/SocialIcons";
import { settingsApi } from "@/lib/api";

// Sits directly above the fixed StatusBar (bottom-7 = StatusBar's own height).
export default function SocialFooter() {
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
  const socials = [
    s.social_whatsapp && { label: "WhatsApp", href: `https://wa.me/${s.social_whatsapp}`, Icon: WhatsappIcon },
    s.social_x && { label: "X", href: s.social_x, Icon: XIcon },
    s.social_linkedin && { label: "LinkedIn", href: s.social_linkedin, Icon: LinkedinIcon },
    s.social_github && { label: "GitHub", href: s.social_github, Icon: GithubIcon },
  ].filter(Boolean);

  if (socials.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-7 z-20 flex h-9 items-center justify-center gap-5 border-t border-term-border bg-term-panel px-4">
      {socials.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          title={label}
          className="text-term-silver-dim transition-colors hover:text-term-gold"
        >
          <Icon width={16} height={16} />
        </a>
      ))}
    </div>
  );
}
