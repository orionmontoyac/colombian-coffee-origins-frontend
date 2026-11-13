import Link from "next/link";
import { cx } from "./cx";

export type BreadcrumbItem = { label: string; href?: string };

/** nav > ol; the last item is the current page (`aria-current="page"`). `tone="dark"` is for banners. */
export function Breadcrumbs({
  items,
  label,
  tone = "light",
  className,
}: {
  items: BreadcrumbItem[];
  label: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <nav aria-label={label} className={className}>
      <ol className={cx("flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px]", dark ? "text-on-primary-muted" : "text-muted")}>
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="inline-flex items-center gap-2">
              {item.href && !last ? (
                <Link href={item.href} className={cx("underline-offset-4 hover:underline", dark ? "hover:text-on-primary" : "hover:text-primary")}>
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={cx(last && (dark ? "text-on-primary" : "text-primary"))}>
                  {item.label}
                </span>
              )}
              {!last ? <span aria-hidden="true">/</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
