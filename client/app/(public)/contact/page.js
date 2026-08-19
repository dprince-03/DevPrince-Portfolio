"use client";

import { useEffect, useState } from "react";
import { contactApi, settingsApi } from "@/lib/api";
import { GithubIcon, LinkedinIcon, XIcon, MailIcon, PinIcon, CheckIcon } from "@/components/icons/SocialIcons";

const inputClass =
  "w-full rounded-lg border border-term-border bg-term-bg px-3.5 py-2.5 text-sm text-term-white outline-none focus:border-term-blue";
const labelClass = "mb-2 block text-[11px] font-bold uppercase tracking-wider text-term-blue";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");
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

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      await contactApi.submit(form);
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-6 pb-20 pt-4 sm:pb-24">
      <p className="text-sm text-term-green">
        you<span className="text-term-blue">@</span>portfolio
        <span className="text-term-silver-dim">:</span>
        <span className="text-term-blue">~/contact</span>
        <span className="text-term-silver-dim">$</span> ./contact.sh
      </p>

      <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="flex-1 overflow-hidden rounded-2xl border border-term-border bg-term-panel/80 backdrop-blur-md">
          <div className="flex items-center gap-2 border-b border-term-border bg-term-bg/60 px-5 py-3.5">
            <span className="h-2.5 w-2.5 rounded-full bg-term-red" />
            <span className="h-2.5 w-2.5 rounded-full bg-term-gold" />
            <span className="h-2.5 w-2.5 rounded-full bg-term-green" />
            <span className="flex-1 text-center text-xs text-term-silver-dim">compose &mdash; new message</span>
          </div>

          <div className="p-8">
            {status === "success" ? (
              <p className="text-term-green">
                <span className="text-term-silver-dim">$</span> message sent &mdash; thanks, I&apos;ll get back to
                you soon.
              </p>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className={labelClass} htmlFor="to">
                    to
                  </label>
                  <p className="text-sm text-term-silver-dim">{settings.social_email || "you@example.com"}</p>
                </div>
                <div>
                  <label className={labelClass} htmlFor="name">
                    name
                  </label>
                  <input id="name" required value={form.name} onChange={update("name")} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="email">
                    from
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={update("email")}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="message">
                    message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={update("message")}
                    className={inputClass}
                  />
                </div>
                {status === "error" && <p className="text-sm text-term-red">error: {error}</p>}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full rounded-lg bg-term-blue py-3 text-sm font-bold text-term-bg transition hover:opacity-90 disabled:opacity-50"
                >
                  {status === "loading" ? "sending..." : "$ send --now"}
                </button>
              </form>
            )}
          </div>
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
    </main>
  );
}
