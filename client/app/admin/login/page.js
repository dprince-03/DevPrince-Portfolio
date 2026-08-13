"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TerminalWindow from "@/components/terminal/TerminalWindow";
import { authApi } from "@/lib/api";

const inputClass =
  "w-full rounded-md border border-term-border bg-term-bg px-3 py-2 text-sm text-term-white outline-none focus:border-term-blue";

export default function AdminLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCredentialsSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authApi.login(email, password);
      setStep("twoFactor");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleTwoFactorSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authApi.verifyTwoFactor(code);
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <TerminalWindow title="auth.sh" animate={false}>
        {step === "credentials" ? (
          <form className="space-y-4" onSubmit={handleCredentialsSubmit}>
            <p className="text-term-silver-dim">
              <span className="text-term-green">$</span> login --admin
            </p>
            <div className="space-y-1">
              <label className="text-xs text-term-silver-dim" htmlFor="email">
                email
              </label>
              <input
                id="email"
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-term-silver-dim" htmlFor="password">
                password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </div>
            {error && <p className="text-sm text-term-red">error: {error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-term-blue/90 px-3 py-2 text-sm font-semibold text-term-bg transition hover:bg-term-blue disabled:opacity-50"
            >
              {loading ? "authenticating..." : "continue"}
            </button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleTwoFactorSubmit}>
            <p className="text-term-silver-dim">
              <span className="text-term-green">$</span> verify --totp
            </p>
            <div className="space-y-1">
              <label className="text-xs text-term-silver-dim" htmlFor="code">
                6-digit code
              </label>
              <input
                id="code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                required
                autoFocus
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={`${inputClass} tracking-[0.5em]`}
              />
            </div>
            {error && <p className="text-sm text-term-red">error: {error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-term-green/90 px-3 py-2 text-sm font-semibold text-term-bg transition hover:bg-term-green disabled:opacity-50"
            >
              {loading ? "verifying..." : "unlock"}
            </button>
          </form>
        )}
      </TerminalWindow>
    </main>
  );
}
