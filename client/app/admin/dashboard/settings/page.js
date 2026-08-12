"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { settingsApi, mediaApi, authApi } from "@/lib/api";
import AdminSection from "@/components/admin/AdminSection";
import { TextField } from "@/components/admin/fields";
import Button from "@/components/admin/Button";
import { SkeletonTerminalCard } from "@/components/ui/Skeleton";

const FIELDS = [
  { key: "tagline", label: "tagline" },
  { key: "now_status", label: "\"now\" status (e.g. \"debugging auth flow\")" },
  { key: "social_github", label: "GitHub URL" },
  { key: "social_linkedin", label: "LinkedIn URL" },
  { key: "social_x", label: "X URL" },
  { key: "social_email", label: "contact email" },
  { key: "github_username", label: "GitHub username (for live stats)" },
];

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState(null);
  const [form, setForm] = useState({});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const fileInput = useRef(null);

  async function handleLogoutAll() {
    if (!confirm("Log out every session on every device? You'll need to log back in here too.")) return;
    setRevoking(true);
    try {
      await authApi.logoutAll();
      router.push("/admin/login");
    } catch (err) {
      setError(err.message);
      setRevoking(false);
    }
  }

  function load() {
    settingsApi
      .list()
      .then((data) => {
        setSettings(data);
        setForm(data);
      })
      .catch((err) => setError(err.message));
  }

  useEffect(load, []);

  function set(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const updated = await settingsApi.update(form);
      setSettings(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleResumeUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const media = await mediaApi.upload(file);
      const updated = await settingsApi.update({ resume_url: media.url });
      setSettings(updated);
      setForm((f) => ({ ...f, resume_url: media.url }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  if (error && !settings) return <p className="text-sm text-term-red">error: {error}</p>;
  if (!settings) return <SkeletonTerminalCard title="settings.json" />;

  return (
    <div className="space-y-6">
      <p className="text-xs uppercase tracking-widest text-term-silver-dim">$ vim settings.json</p>

      <AdminSection title="settings.json">
        <form onSubmit={handleSave} className="space-y-4">
          {FIELDS.map(({ key, label }) => (
            <TextField key={key} id={key} label={label} value={form[key] || ""} onChange={set(key)} />
          ))}
          {error && <p className="text-sm text-term-red">error: {error}</p>}
          <Button type="submit" disabled={saving}>
            {saving ? "saving..." : "save settings"}
          </Button>
        </form>
      </AdminSection>

      <AdminSection title="resume.pdf">
        <div className="space-y-3">
          {settings.resume_url ? (
            <p className="text-sm text-term-silver">
              Current file:{" "}
              <a href={settings.resume_url} target="_blank" rel="noreferrer" className="text-term-blue hover:underline">
                {settings.resume_url}
              </a>
            </p>
          ) : (
            <p className="text-sm text-term-silver-dim">No resume uploaded yet.</p>
          )}
          <input
            ref={fileInput}
            type="file"
            accept="application/pdf"
            onChange={handleResumeUpload}
            disabled={uploading}
            className="text-sm text-term-silver file:mr-3 file:rounded-md file:border file:border-term-border file:bg-term-bg file:px-3 file:py-1.5 file:text-xs file:text-term-silver"
          />
          {uploading && <p className="text-xs text-term-silver-dim">uploading...</p>}
        </div>
      </AdminSection>

      <AdminSection title="security.sh">
        <div className="space-y-2">
          <p className="text-sm text-term-silver">
            If you suspect a session token has leaked (lost device, shared computer), revoke every
            outstanding login at once — including this one.
          </p>
          <Button type="button" variant="danger" onClick={handleLogoutAll} disabled={revoking}>
            {revoking ? "revoking..." : "log out everywhere"}
          </Button>
        </div>
      </AdminSection>
    </div>
  );
}
