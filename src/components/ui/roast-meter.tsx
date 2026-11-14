import { Bean } from "./bean";

/**
 * Five bean icons: full opacity up to the roast level, 22% for the rest.
 * `label` is read by screen readers; `hint` is the hover text that explains the scale.
 */
export function RoastMeter({
  level,
  label,
  hint,
  size = 16,
}: {
  level: 1 | 2 | 3 | 4 | 5;
  label: string;
  /** Shown on hover / focus. Defaults to `label` when omitted. */
  hint?: string;
  size?: number;
}) {
  const tip = hint ?? label;
  return (
    <span className="group relative inline-flex max-w-full items-center gap-1 outline-none">
      <span
        tabIndex={0}
        aria-label={label}
        className="inline-flex cursor-help items-center gap-1 rounded-sm focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-roast"
      >
        <span aria-hidden="true" className="inline-flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Bean key={i} size={size} style={{ opacity: i <= level ? 1 : 0.22 }} />
          ))}
        </span>
        <span className="sr-only">{label}</span>
      </span>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-[calc(100%+8px)] left-0 z-20 w-max max-w-[240px] rounded-[10px] bg-ink px-2 py-1.5 text-left text-body-sm text-on-primary opacity-0 shadow-none transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {tip}
      </span>
    </span>
  );
}
