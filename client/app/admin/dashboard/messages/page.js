"use client";

import { useEffect, useState } from "react";
import { messagesApi } from "@/lib/api";
import AdminSection from "@/components/admin/AdminSection";
import { SkeletonTerminalCard } from "@/components/ui/Skeleton";

export default function MessagesPage() {
  const [messages, setMessages] = useState(null);
  const [error, setError] = useState("");

  function load() {
    messagesApi.list().then(setMessages).catch((err) => setError(err.message));
  }

  useEffect(load, []);

  async function toggleRead(message) {
    try {
      await messagesApi.markRead(message.id, !message.read);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-xs uppercase tracking-widest text-term-silver-dim">$ cat messages.json</p>

      {error && <p className="text-sm text-term-red">error: {error}</p>}
      {!messages && !error && <SkeletonTerminalCard title="messages.json" />}

      {messages && (
        <AdminSection title="messages.json">
          {messages.length === 0 ? (
            <p className="text-sm text-term-silver-dim">No messages yet.</p>
          ) : (
            <div className="divide-y divide-term-border">
              {messages.map((message) => (
                <div key={message.id} className={`py-4 ${message.read ? "opacity-60" : ""}`}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm text-term-white">
                        {message.name}{" "}
                        <span className="text-term-silver-dim">&lt;{message.email}&gt;</span>
                      </p>
                      <p className="text-[10px] text-term-silver-dim">
                        {new Date(message.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleRead(message)}
                      className="shrink-0 text-xs text-term-blue hover:underline"
                    >
                      mark {message.read ? "unread" : "read"}
                    </button>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-term-silver">{message.message}</p>
                </div>
              ))}
            </div>
          )}
        </AdminSection>
      )}
    </div>
  );
}
