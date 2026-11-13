/** First focusable element on every page: jumps to `#main`. Visible only on focus. */
export function SkipLink({ label, target = "main" }: { label: string; target?: string }) {
  return (
    <a
      href={`#${target}`}
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-5 focus:py-3 focus:font-label focus:text-label-md focus:text-on-primary"
    >
      {label}
    </a>
  );
}
