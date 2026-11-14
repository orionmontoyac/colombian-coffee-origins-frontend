import { cx } from "./cx";

/** Build a wa.me link. `number` may contain spaces, "+" and dashes; only digits are kept. */
export function whatsappUrl(number: string, message?: string): string {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}

/** Link to WhatsApp with a prefilled message. Set `floating` for the corner button. */
export function WhatsAppButton({
  number,
  message,
  label,
  floating = false,
  className,
}: {
  number: string;
  message?: string;
  label: string;
  floating?: boolean;
  className?: string;
}) {
  return (
    <a
      href={whatsappUrl(number, message)}
      target="_blank"
      rel="noopener noreferrer"
      className={cx(
        "inline-flex min-h-tap-target items-center gap-2 rounded-full bg-accent px-5 py-3 font-label text-label-md text-on-accent transition-colors duration-200 hover:bg-accent-hover",
        floating && "fixed bottom-4 right-4 z-50",
        className,
      )}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 21l1.6-4.7A8.5 8.5 0 1 1 8 19.6L3 21z" />
        <path d="M9 9.5c.3 2 2.5 4.2 4.5 4.5l1.2-1.2-1.8-1-.8.6c-.8-.4-1.5-1.1-1.9-1.9l.6-.8-1-1.8L9 9.5z" />
      </svg>
      {label}
    </a>
  );
}
