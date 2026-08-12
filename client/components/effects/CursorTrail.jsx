"use client";

import { useEffect, useRef } from "react";

export default function CursorTrail() {
  const ref = useRef(null);

  useEffect(() => {
    // No real cursor to trail on touch devices.
    if (window.matchMedia("(pointer: coarse)").matches) return undefined;

    function handleMove(e) {
      if (ref.current) {
        ref.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    }

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-30 h-4 w-2 -translate-x-1/2 -translate-y-1/2
                 animate-blink bg-term-green/70 transition-transform duration-150 ease-out"
    />
  );
}
