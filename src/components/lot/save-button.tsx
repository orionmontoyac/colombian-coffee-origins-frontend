"use client";

import { useSyncExternalStore } from "react";

const KEY = "cco:saved-lots";
const EVENT = "cco:saved-lots-change";

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(EVENT, cb);
  };
}
const read = () => {
  try {
    return window.localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
};

/** Heart toggle that remembers saved lot codes in localStorage (no account needed). */
export function SaveLotButton({ code, label, savedLabel }: { code: string; label: string; savedLabel: string }) {
  const stored = useSyncExternalStore(subscribe, read, () => "");
  const saved = stored.split(",").includes(code);

  function toggle() {
    const codes = stored.split(",").filter(Boolean);
    const next = saved ? codes.filter((c) => c !== code) : [...codes, code];
    try {
      window.localStorage.setItem(KEY, next.join(","));
    } catch {
      /* storage blocked: the toggle simply does nothing */
    }
    window.dispatchEvent(new Event(EVENT));
  }

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? savedLabel : label}
      onClick={toggle}
      className="flex size-[52px] flex-none items-center justify-center rounded-full bg-neutral text-primary ring-[1.5px] ring-inset ring-primary transition-colors duration-200 hover:bg-surface focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-primary"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
      </svg>
    </button>
  );
}
