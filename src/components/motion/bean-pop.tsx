"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Replays a short scale pop on its child whenever `value` changes (not on first render). */
export function BeanPop({ value, children, className }: { value: number; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(value);
  useEffect(() => {
    if (prev.current !== value && value > prev.current) {
      const el = ref.current;
      el?.classList.remove("bean-pop");
      void el?.offsetWidth;
      el?.classList.add("bean-pop");
    }
    prev.current = value;
  }, [value]);
  return (
    <span ref={ref} className={`inline-block ${className ?? ""}`}>
      {children}
    </span>
  );
}
