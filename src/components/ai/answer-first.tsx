import type { Locale } from "@/app/[lang]/dictionaries";
import { answerFor, type AnswerKind } from "@/lib/ai/answers";

/**
 * Answer-first block: one plain sentence that says what the page is (with entity names) and a
 * 4-6 row facts table. Server-rendered, visible, generated from src/data + src/lib/ai/facts.ts.
 */
export function AnswerFirst({ lang, kind, id }: { lang: Locale; kind: AnswerKind; id?: string }) {
  const { answer, rows, note } = answerFor(lang, kind, id);
  const caption = lang === "es" ? "Datos clave" : "Key facts";
  return (
    <section aria-label={caption} data-testid="answer-first" className="mx-auto mt-6 w-full max-w-5xl rounded-lg bg-surface p-6 sm:p-8">
      <p className="font-sans text-body-lg text-primary">{answer}</p>
      <table className="mt-5 w-full border-collapse text-left">
        <caption className="sr-only">{caption}</caption>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-t border-line">
              <th scope="row" className="w-1/3 py-2 pr-4 align-top font-sans text-body-sm font-semibold text-muted">{r.label}</th>
              <td className="py-2 font-sans text-body-md text-primary">{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 font-sans text-body-sm text-muted">{note}</p>
    </section>
  );
}
