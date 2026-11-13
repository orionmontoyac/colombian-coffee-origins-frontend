import type { Dictionary } from "@/app/[lang]/dictionaries";
import { Chip, SectionHeader } from "@/components/ui";

type T = Dictionary["forms"]["sell"]["ways"];

/** The two ways to sell. Green is the platform line; the roasted way sits on crema and carries the CO pill. */
export function Ways({ t }: { t: T }) {
  return (
    <section aria-label={`${t.title} ${t.accent}`} className="mt-section-gap">
      <SectionHeader title={t.title} accent={t.accent} text={t.text} />
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-surface p-6 sm:p-8">
          <Chip tone="neutral">{t.green.tag}</Chip>
          <h3 className="mt-4 font-display text-headline-md text-primary">{t.green.title}</h3>
          <p className="mt-3 max-w-[52ch] text-body-md text-body">{t.green.text}</p>
          <ul className="mt-5 grid gap-2 border-t border-line pt-5 text-body-md text-ink">
            {t.green.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg bg-roast-surface p-6 sm:p-8">
          <Chip tone="co">{t.roasted.tag}</Chip>
          <h3 className="mt-4 font-display text-headline-md text-roast-dark">{t.roasted.title}</h3>
          <p className="mt-3 max-w-[52ch] text-body-md text-roast-body">{t.roasted.text}</p>
          <ul className="mt-5 grid gap-2 border-t border-roast-line pt-5 text-body-md text-roast-dark">
            {t.roasted.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
