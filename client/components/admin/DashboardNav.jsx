"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin/dashboard", label: "overview", exact: true },
  { href: "/admin/dashboard/projects", label: "projects" },
  { href: "/admin/dashboard/skills", label: "skills" },
  { href: "/admin/dashboard/messages", label: "messages" },
  { href: "/admin/dashboard/media", label: "media" },
  { href: "/admin/dashboard/settings", label: "settings" },
  { href: "/admin/dashboard/analytics", label: "analytics" },
  { href: "/admin/dashboard/activity", label: "activity" },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="w-full shrink-0 border-b border-term-border sm:w-48 sm:border-b-0 sm:border-r">
      <div className="flex gap-1 overflow-x-auto p-3 sm:flex-col sm:overflow-visible">
        {LINKS.map((link) => {
          const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap rounded-md px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-term-border/60 text-term-gold"
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
