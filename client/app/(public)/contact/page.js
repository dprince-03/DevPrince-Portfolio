"use client";

import { useEffect, useState } from "react";
import { settingsApi } from "@/lib/api";
import ContactFlipCard from "@/components/contact/ContactFlipCard";
import { GithubIcon, LinkedinIcon, XIcon, WhatsappIcon, MailIcon, PinIcon, CheckIcon } from "@/components/icons/SocialIcons";

export default function ContactPage() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [settings, setSettings] = useState({});

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

  return (
    <main className="mx-auto max-w-6xl px-6 pb-20 pt-4 sm:pb-24">
      <p className="text-sm text-term-green">
        you<span className="text-term-blue">@</span>portfolio
        <span className="text-term-silver-dim">:</span>
        <span className="text-term-blue">~/contact</span>
        <span className="text-term-silver-dim">$</span> ./contact.sh
      </p>

      <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="flex-1">
          <ContactFlipCard onSuccess={() => setShowConfirm(true)} />
        </div>

        <div className="w-full flex-shrink-0 rounded-2xl border border-term-border bg-term-panel/80 p-7 backdrop-blur-md lg:w-[300px]">
          <p className="mb-5 text-xs font-bold uppercase tracking-widest text-term-blue">Direct</p>

          <div className="flex flex-col gap-5">
            {settings.social_email && (
              <div className="flex items-center gap-3.5">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-term-blue/15 text-term-blue">
                  <MailIcon />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-term-silver-dim">Email</p>
                  <p className="mt-0.5 text-sm font-semibold text-term-white">{settings.social_email}</p>
                </div>
              </div>
            )}
            {settings.location && (
              <div className="flex items-center gap-3.5">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-term-blue/15 text-term-blue">
                  <PinIcon />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-term-silver-dim">Location</p>
                  <p className="mt-0.5 text-sm font-semibold text-term-white">{settings.location}</p>
                </div>
              </div>
            )}
            {settings.availability && (
              <div className="flex items-center gap-3.5">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-term-blue/15 text-term-blue">
                  <CheckIcon />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-term-silver-dim">Available</p>
                  <p className="mt-0.5 text-sm font-semibold text-term-green">{settings.availability}</p>
                </div>
              </div>
            )}
          </div>

          <div className="my-6 h-px w-full bg-term-border" />

          <div className="flex gap-2.5">
            {settings.social_whatsapp && (
              <a
                href={`https://wa.me/${settings.social_whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-term-blue/15 text-term-blue transition-colors hover:bg-term-blue/25"
              >
                <WhatsappIcon />
              </a>
            )}
            {settings.social_github && (
              <a
                href={settings.social_github}
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-term-blue/15 text-term-blue transition-colors hover:bg-term-blue/25"
              >
                <GithubIcon />
              </a>
            )}
            {settings.social_linkedin && (
              <a
                href={settings.social_linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-term-blue/15 text-term-blue transition-colors hover:bg-term-blue/25"
              >
                <LinkedinIcon />
              </a>
            )}
            {settings.social_x && (
              <a
                href={settings.social_x}
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-term-blue/15 text-term-blue transition-colors hover:bg-term-blue/25"
              >
                <XIcon />
              </a>
            )}
          </div>
        </div>
      </div>

      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6"
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-term-border bg-term-panel p-8 text-center shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-term-green/15 text-term-green">
              <CheckIcon width={22} height={22} />
            </div>
            <p className="mt-4 text-base font-semibold text-term-white">I&apos;ll reach out to you shortly.</p>
            <button
              type="button"
              onClick={() => setShowConfirm(false)}
              className="mt-6 w-full rounded-lg bg-term-blue py-2.5 text-sm font-bold text-term-bg transition hover:opacity-90"
            >
              close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
