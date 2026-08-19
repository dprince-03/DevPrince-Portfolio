"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";

const TOOLBAR_ICONS = ["📄", "⧉", "📁", "⇩", "(){ }"];

export default function TerminalWindow({
  title = "terminal",
  lines,
  children,
  className = "",
  bodyClassName = "",
  animate = true,
}) {
  const Wrapper = animate ? motion.div : "div";
  const motionProps = animate
    ? {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-10%" },
        transition: { duration: 0.4, ease: "easeOut" },
      }
    : {};

  return (
    <Wrapper
      {...motionProps}
      className={`relative flex flex-col overflow-hidden rounded-xl border border-term-border bg-term-panel/80 backdrop-blur-md shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_20px_60px_-20px_rgba(0,0,0,0.8)] ${className}`}
    >
      <div className="flex shrink-0 items-center gap-2 border-b border-term-border px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-term-red" />
        <span className="h-3 w-3 rounded-full bg-term-gold" />
        <span className="h-3 w-3 rounded-full bg-term-green" />
        <span className="ml-3 truncate text-sm text-term-silver">{title}</span>
      </div>

      <div className="hidden shrink-0 items-center gap-4 border-b border-term-border px-4 py-2 text-xs text-term-silver-dim sm:flex">
        {TOOLBAR_ICONS.map((icon) => (
          <span key={icon} className="select-none opacity-70">
            {icon}
          </span>
        ))}
      </div>

      <div className={`min-h-0 flex-1 p-5 sm:p-6 ${bodyClassName}`}>
        {lines ? (
          <div className="grid grid-cols-[auto_1fr] gap-x-4 text-sm leading-relaxed">
            {lines.map((line, i) => (
              <Fragment key={i}>
                <span className="select-none text-right text-term-silver-dim">
                  {i + 1}
                </span>
                <span>{line}</span>
              </Fragment>
            ))}
          </div>
        ) : (
          <div className="text-sm leading-relaxed">{children}</div>
        )}
      </div>
    </Wrapper>
  );
}
