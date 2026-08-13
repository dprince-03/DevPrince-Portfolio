"use client";

import { useEffect, useRef } from "react";

const CHARS = "01アイウエオカキクケコ{}[]<>/;=+-*$#@";

export default function MatrixRain({ enabled }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrame;
    let columns = [];
    const fontSize = 14;

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const columnCount = Math.floor(canvas.width / fontSize);
      columns = Array.from({ length: columnCount }, () => Math.random() * -canvas.height);
    }

    function draw() {
      ctx.fillStyle = "rgba(10, 10, 10, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px monospace`;
      ctx.fillStyle = "rgba(74, 222, 128, 0.35)"; // term-green, low opacity

      columns.forEach((y, i) => {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = i * fontSize;
        ctx.fillText(char, x, y);
        columns[i] = y > canvas.height && Math.random() > 0.975 ? 0 : y + fontSize;
      });

      animationFrame = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    draw();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full opacity-60"
    />
  );
}
