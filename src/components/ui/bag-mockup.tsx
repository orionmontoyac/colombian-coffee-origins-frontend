import { Bean } from "./bean";

/**
 * Drawn coffee bag in the brand's color (until real product photos exist).
 * `color` is content (each producer brand picks its own bag color), so it is an inline style.
 * The only shadow in the system lives here: canopy green at 18%, under the bag.
 */
export function BagMockup({
  color,
  brand,
  roastLabel,
  size,
  beanIcon = true,
}: {
  color: string;
  brand: string;
  roastLabel: string;
  size: string;
  beanIcon?: boolean;
}) {
  return (
    <div
      className="relative flex h-[200px] w-[140px] flex-col items-center overflow-hidden rounded-b-sm rounded-t-md shadow-[0_18px_30px_rgb(14_42_31/0.18)]"
      style={{ background: color }}
    >
      <div className="h-6 w-full bg-black/20" />
      <div className="mt-2.5 size-2.5 rounded-full bg-neutral/35" />
      <div className="mt-4 w-[104px] rounded-sm bg-neutral px-2 py-3 text-center">
        {beanIcon ? <Bean size={14} className="mx-auto mb-1" /> : null}
        <p className="font-display text-[13px] font-bold leading-[1.1] text-primary">{brand}</p>
        <p className="mt-1.5 font-label text-[10px] font-medium uppercase tracking-[0.06em] text-roast">{roastLabel}</p>
        <p className="mt-1 text-[10px] text-muted">{size}</p>
      </div>
    </div>
  );
}
