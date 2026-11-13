import { Bean } from "./bean";

/**
 * Five bean icons: full opacity up to the roast level, 22% for the rest.
 * `label` (for example "Roast level: light") is read by screen readers; the beans are decorative.
 */
export function RoastMeter({ level, label, size = 16 }: { level: 1 | 2 | 3 | 4 | 5; label: string; size?: number }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span aria-hidden="true" className="inline-flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <Bean key={i} size={size} style={{ opacity: i <= level ? 1 : 0.22 }} />
        ))}
      </span>
      <span className="sr-only">{label}</span>
    </span>
  );
}
