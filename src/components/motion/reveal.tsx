"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * One-time 12px rise + fade for section headers and card grids. Server HTML is fully visible;
 * after hydration only blocks that start below the fold are hidden, then shown once at 15% visible.
 */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || el.dataset.reveal === "in") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    el.dataset.reveal = "wait";
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.reveal = "in";
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} data-reveal="idle" className={className}>
      {children}
    </div>
  );
}
