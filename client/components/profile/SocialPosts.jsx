"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import TerminalWindow from "@/components/terminal/TerminalWindow";
import { postsApi } from "@/lib/api";

// LinkedIn post URLs carry the activity id as e.g. "...-activity-7123456789012345678-..."
// or "urn:li:activity:7123456789012345678" — their embed endpoint wants that id alone.
function linkedInEmbedUrl(url) {
  const match = url.match(/activity[:-](\d{10,25})/);
  return match ? `https://www.linkedin.com/embed/feed/update/urn:li:activity:${match[1]}` : null;
}

function LinkedInEmbed({ post }) {
  const embedUrl = linkedInEmbedUrl(post.url);
  if (!embedUrl) {
    return (
      <a href={post.url} target="_blank" rel="noreferrer" className="text-sm text-term-blue hover:underline">
        View LinkedIn post &rarr;
      </a>
    );
  }
  return (
    <iframe
      src={embedUrl}
      height={570}
      width="100%"
      title="LinkedIn post"
      className="rounded-lg border border-term-border"
    />
  );
}

export default function SocialPosts({ className = "" }) {
  const [posts, setPosts] = useState(null);
  const [twitterReady, setTwitterReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    postsApi
      .list()
      .then((data) => !cancelled && setPosts(data))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (twitterReady && window.twttr?.widgets) {
      window.twttr.widgets.load();
    }
  }, [twitterReady, posts]);

  if (!posts || posts.length === 0) return null;

  return (
    <TerminalWindow title="posts.json" animate={false} className={className}>
      <Script src="https://platform.twitter.com/widgets.js" strategy="lazyOnload" onLoad={() => setTwitterReady(true)} />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {posts.map((post) =>
          post.platform === "X" ? (
            <blockquote key={post.id} className="twitter-tweet" data-theme="dark">
              <a href={post.url}>{post.url}</a>
            </blockquote>
          ) : (
            <LinkedInEmbed key={post.id} post={post} />
          )
        )}
      </div>
    </TerminalWindow>
  );
}
