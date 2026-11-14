export function ArrowCircle({ tone, size = 30 }: { tone: "lime" | "crema"; size?: number }) {
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size }}
      className={`flex flex-none items-center justify-center rounded-full text-base ${
        tone === "lime" ? "bg-accent text-on-accent" : "bg-roast-surface text-roast"
      }`}
    >
      →
    </span>
  );
}

export function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 4h2.2l2.1 10.2a1.6 1.6 0 0 0 1.6 1.3h7.6a1.6 1.6 0 0 0 1.6-1.2L20 8H6.1" />
      <circle cx="9.5" cy="19.5" r="1.3" />
      <circle cx="17" cy="19.5" r="1.3" />
    </svg>
  );
}
