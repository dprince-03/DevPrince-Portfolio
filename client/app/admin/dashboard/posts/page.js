"use client";

import { useEffect, useState } from "react";
import { postsApi } from "@/lib/api";
import AdminSection from "@/components/admin/AdminSection";
import { TextField, SelectField } from "@/components/admin/fields";
import Button from "@/components/admin/Button";
import { SkeletonTerminalCard } from "@/components/ui/Skeleton";

const PLATFORMS = ["X", "LINKEDIN"];

export default function PostsPage() {
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState("");
  const [url, setUrl] = useState("");
  const [platform, setPlatform] = useState("X");

  function load() {
    postsApi.list().then(setPosts).catch((err) => setError(err.message));
  }

  useEffect(load, []);

  async function handleAdd(e) {
    e.preventDefault();
    if (!url.trim()) return;
    try {
      await postsApi.create({ url: url.trim(), platform });
      setUrl("");
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(post) {
    try {
      await postsApi.remove(post.id);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-xs uppercase tracking-widest text-term-silver-dim">$ cat posts.json --admin</p>

      <AdminSection title="add-post.json">
        <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-3">
          <SelectField id="postPlatform" label="platform" value={platform} onChange={(e) => setPlatform(e.target.value)}>
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </SelectField>
          <TextField
            id="postUrl"
            label="post URL"
            className="min-w-[320px]"
            placeholder="https://x.com/you/status/... or https://www.linkedin.com/posts/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button type="submit" variant="ghost">
            + add
          </Button>
        </form>
        <p className="mt-2 text-xs text-term-silver-dim">
          Paste the URL of a public post you want featured. It renders as a real embed on the Projects page — nothing
          is fetched automatically.
        </p>
      </AdminSection>

      {error && <p className="text-sm text-term-red">error: {error}</p>}
      {!posts && !error && <SkeletonTerminalCard title="posts.json" />}

      {posts && (
        <AdminSection title="posts.json">
          {posts.length === 0 ? (
            <p className="text-sm text-term-silver-dim">None yet.</p>
          ) : (
            <div className="space-y-2">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between gap-3 rounded-md border border-term-border px-3 py-2"
                >
                  <div className="min-w-0">
                    <span className="mr-2 text-xs font-semibold text-term-blue">{post.platform}</span>
                    <span className="truncate text-sm text-term-silver">{post.url}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(post)}
                    className="shrink-0 text-xs text-term-red hover:underline"
                  >
                    delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </AdminSection>
      )}
    </div>
  );
}
