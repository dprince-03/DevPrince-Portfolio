"use client";

import { useEffect, useRef, useState } from "react";
import { mediaApi, API_URL } from "@/lib/api";
import AdminSection from "@/components/admin/AdminSection";
import Button from "@/components/admin/Button";
import { SkeletonTerminalCard } from "@/components/ui/Skeleton";

function absoluteUrl(url) {
  // API_URL is "" in prod (same-origin through nginx) — url is already
  // absolute-from-root in that case, so this just returns it unchanged.
  return `${API_URL}${url}`;
}

export default function MediaPage() {
  const [media, setMedia] = useState(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef(null);

  function load() {
    mediaApi.list().then(setMedia).catch((err) => setError(err.message));
  }

  useEffect(load, []);

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      await mediaApi.upload(file);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  async function handleDelete(item) {
    if (!confirm(`Delete "${item.filename}"?`)) return;
    try {
      await mediaApi.remove(item.id);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-widest text-term-silver-dim">$ ls ~/media</p>
        <input
          ref={fileInput}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif,application/pdf"
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
        />
        <Button type="button" onClick={() => fileInput.current?.click()} disabled={uploading}>
          {uploading ? "uploading..." : "+ upload"}
        </Button>
      </div>

      {error && <p className="text-sm text-term-red">error: {error}</p>}
      {!media && !error && <SkeletonTerminalCard title="media.json" />}

      {media && (
        <AdminSection title="media.json">
          {media.length === 0 ? (
            <p className="text-sm text-term-silver-dim">No files uploaded yet.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {media.map((item) => (
                <div key={item.id} className="rounded-lg border border-term-border p-2">
                  {item.mimeType.startsWith("image/") ? (
                    // eslint-disable-next-line @next/next/no-img-element -- admin thumbnail grid, not worth next/image config for arbitrary uploaded assets
                    <img src={absoluteUrl(item.url)} alt={item.filename} className="h-24 w-full rounded object-cover" />
                  ) : (
                    <div className="flex h-24 w-full items-center justify-center rounded bg-term-bg text-2xl">📄</div>
                  )}
                  <p className="mt-2 truncate text-[10px] text-term-silver-dim" title={item.filename}>
                    {item.filename}
                  </p>
                  <div className="mt-1 flex items-center justify-between">
                    <a
                      href={absoluteUrl(item.url)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-term-blue hover:underline"
                    >
                      open
                    </a>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      className="text-[10px] text-term-red hover:underline"
                    >
                      delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminSection>
      )}
    </div>
  );
}
