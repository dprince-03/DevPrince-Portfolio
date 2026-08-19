"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin/dashboard", label: "overview", exact: true },
  { href: "/admin/dashboard/projects", label: "projects" },
  { href: "/admin/dashboard/skills", label: "skills" },
  { href: "/admin/dashboard/messages", label: "messages" },
  { href: "/admin/dashboard/posts", label: "posts" },
  { href: "/admin/dashboard/media", label: "media" },
  { href: "/admin/dashboard/settings", label: "settings" },
  { href: "/admin/dashboard/analytics", label: "analytics" },
  { href: "/admin/dashboard/activity", label: "activity" },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="w-full shrink-0 rounded-2xl border border-term-border bg-term-panel/80 p-2 backdrop-blur-md sm:w-48">
      <div className="flex gap-1 overflow-x-auto sm:flex-col sm:overflow-visible">
        {LINKS.map((link) => {
          const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-term-blue/15 text-term-blue"
                  : "text-term-silver hover:bg-term-border/30 hover:text-term-white"
              }`}
            >
              ~/{link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
