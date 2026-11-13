import type { Dictionary } from "@/app/[lang]/dictionaries";
import type { FormStrings } from "./form-shell";

type Forms = Dictionary["forms"];

/** Merge the shared strings with one form's submit label and success message. */
export function formStrings(forms: Forms, form: { submit: string; success: { title: string; text: string } }): FormStrings {
  const s = forms.shared;
  return {
    errors: s.errors,
    summaryTitle: s.summaryTitle,
    optional: s.optional,
    consent: s.consent,
    submit: form.submit,
    sending: s.sending,
    honeypotLabel: s.honeypotLabel,
    success: form.success,
  };
}

export const fill = (s: string, vars: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ""));
