"use client";

import { useState } from "react";
import TerminalWindow from "@/components/terminal/TerminalWindow";
import { contactApi } from "@/lib/api";

const inputClass =
  "w-full rounded-md border border-term-border bg-term-bg px-3 py-2 text-sm text-term-white outline-none focus:border-term-blue";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");

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
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-16 sm:py-20">
      <p className="text-xs uppercase tracking-widest text-term-silver-dim">$ ./contact.sh</p>
      {/* Narrower than the page shell on purpose — a form stretched to 1152px looks off */}
      <div className="max-w-2xl">
        <TerminalWindow title="contact.sh" animate={false}>
          {status === "success" ? (
            <p className="text-term-green">
              <span className="text-term-silver-dim">$</span> message sent — thanks, I&apos;ll get back to you soon.
            </p>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <p className="text-term-silver-dim">
                <span className="text-term-green">$</span> send --to devprince
              </p>
              <div className="space-y-1">
                <label className="text-xs text-term-silver-dim" htmlFor="name">
                  name
                </label>
                <input id="name" required value={form.name} onChange={update("name")} className={inputClass} />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-term-silver-dim" htmlFor="email">
                  email
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
              <div className="space-y-1">
                <label className="text-xs text-term-silver-dim" htmlFor="message">
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
                className="rounded-md bg-term-blue/90 px-4 py-2 text-sm font-semibold text-term-bg transition hover:bg-term-blue disabled:opacity-50"
              >
                {status === "loading" ? "sending..." : "send"}
              </button>
            </form>
          )}
        </TerminalWindow>
      </div>
    </main>
  );
}
