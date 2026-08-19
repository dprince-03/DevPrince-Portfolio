"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "home" },
  { href: "/about", label: "about" },
  { href: "/projects", label: "projects" },
  { href: "/resume", label: "resume" },
  { href: "/contact", label: "contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const activeIndex = Math.max(0, LINKS.findIndex((l) => l.href === pathname));
  const path = pathname === "/" ? "~/portfolio" : `~/portfolio${pathname}`;

  return (
    <nav className="sticky top-0 z-20 flex justify-center px-6 py-8">
      <div className="flex items-center gap-4 rounded-xl border border-term-border bg-term-panel/80 px-4 py-2.5 backdrop-blur-md sm:gap-5">
        <div className="flex gap-1.5">
          {LINKS.map((link, i) => (
            <span
              key={link.href}
              className={`h-2 w-2 rounded-sm ${i === activeIndex ? "bg-term-blue" : "bg-term-border"}`}
            />
          ))}
        </div>
        <div className="h-4 w-px bg-term-border" />
        <div className="flex gap-4 text-[13px] font-medium sm:gap-6">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                pathname === link.href
                  ? "text-term-white"
                  : "text-term-silver transition-colors hover:text-term-white"
              }
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="hidden h-4 w-px bg-term-border sm:block" />
        <span className="hidden text-xs text-term-green sm:inline">{path}</span>
      </div>
    </nav>
  );
}
