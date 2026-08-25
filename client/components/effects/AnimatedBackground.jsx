"use client";

import { useEffect, useRef } from "react";

// Circuit-grid floor + traveling light pulses (CSS) layered under a drifting
// particle-network canvas (JS) — sits on top of the base blue-glow gradient
// in globals.css, never replaces it. Skips all motion under
// prefers-reduced-motion: the grid stays as static texture, the canvas just
// doesn't start.
export default function AnimatedBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return undefined;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const LINK_DIST = 150;
    const MOUSE_DIST = 150;
    const mouse = { x: -9999, y: -9999 };
    let particles = [];
    let animationFrame;

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const count = Math.min(110, Math.round((canvas.width * canvas.height) / 16000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      }));
    }

    function onMove(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
    function onLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < MOUSE_DIST) {
          p.x += dx * 0.012;
          p.y += dy * 0.012;
        }
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK_DIST) {
            ctx.strokeStyle = `rgba(90,200,250,${0.34 * (1 - d / LINK_DIST)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(220,235,255,0.95)";
        ctx.fill();
      }

      animationFrame = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    draw();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <style>{`
        .bg-grid-floor {
          position: absolute; left: -200px; right: -200px; bottom: 64px; height: 760px;
          background-image:
            repeating-linear-gradient(0deg, rgba(90,200,250,0.40) 0 1px, transparent 1px 60px),
            repeating-linear-gradient(90deg, rgba(90,200,250,0.40) 0 1px, transparent 1px 60px);
          transform: perspective(700px) rotateX(62deg);
          transform-origin: bottom;
          -webkit-mask-image: linear-gradient(to top, black 0%, transparent 88%);
          mask-image: linear-gradient(to top, black 0%, transparent 88%);
        }
        .bg-pulse { position: absolute; width: 6px; height: 6px; border-radius: 50%; background: #5ac8fa; box-shadow: 0 0 10px 3px rgba(90,200,250,0.85); }
        .bg-pulse-1 { bottom: 104px; left: 22%; animation: bg-travel-a 7s linear infinite; }
        .bg-pulse-2 { bottom: 104px; left: 48%; animation: bg-travel-b 9s linear infinite 2.2s; }
        .bg-pulse-3 { bottom: 104px; left: 66%; animation: bg-travel-c 6.2s linear infinite 4s; }
        .bg-pulse-4 { bottom: 104px; left: 36%; animation: bg-travel-a 9.5s linear infinite 1s; }
        @keyframes bg-travel-a { 0% { transform: translateY(0); opacity: 0; } 8% { opacity: 1; } 85% { opacity: 1; } 100% { transform: translateY(-600px); opacity: 0; } }
        @keyframes bg-travel-b { 0% { transform: translateY(0); opacity: 0; } 8% { opacity: 1; } 85% { opacity: 1; } 100% { transform: translateY(-630px); opacity: 0; } }
        @keyframes bg-travel-c { 0% { transform: translateY(0); opacity: 0; } 8% { opacity: 1; } 85% { opacity: 1; } 100% { transform: translateY(-570px); opacity: 0; } }
        @media (prefers-reduced-motion: reduce) {
          .bg-pulse { animation: none !important; opacity: 0 !important; }
        }
      `}</style>

      <div className="bg-grid-floor" />
      <div className="bg-pulse bg-pulse-1" />
      <div className="bg-pulse bg-pulse-2" />
      <div className="bg-pulse bg-pulse-3" />
      <div className="bg-pulse bg-pulse-4" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
