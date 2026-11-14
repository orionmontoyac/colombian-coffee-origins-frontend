import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import { lots } from "@/data/lots";
import { submitSamples } from "@/lib/actions/forms";
import type { FormState } from "@/lib/actions/types";
import { href } from "@/lib/routes";
import { Button } from "@/components/ui";
import { FormShell, SelectField, TextArea, TextField } from "./form-shell";
import { fill, formStrings } from "./strings";

/**
 * `?lot=URR-024` preselects the lot in the browser (the select only offers codes from
 * src/data/lots.ts, so unknown codes are ignored). Keeping the page static means the form
 * is in the first HTML and visible without JavaScript.
 */
export function SamplesForm({ lang, dict, initial }: { lang: Locale; dict: Dictionary; initial?: FormState }) {
  const t = dict.forms.samples.form;
  const options = lots
    .filter((l) => l.sampleAvailable)
    .map((l) => ({ value: l.code, label: fill(t.lotOption, { code: l.code, name: l.name[lang] }) }));
  const f = "samples";

  return (
    <FormShell
      formId={f}
      action={submitSamples}
      initial={initial}
      lang={lang}
      t={formStrings(dict.forms, t)}
      labels={dict.forms.shared.labels}
      privacyHref={href(lang, "privacy")}
      successExtra={
        <Button href={href(lang, "coffees")} variant="primary">
          {dict.forms.shared.seeLots}
        </Button>
      }
    >
      <h2 className="font-display text-headline-md text-primary">{t.title}</h2>
      <TextField formId={f} name="name" label={t.name} required autoComplete="name" />
      <TextField formId={f} name="email" type="email" label={t.email} required autoComplete="email" />
      <TextField formId={f} name="company" label={t.company} required autoComplete="organization" />
      <TextField formId={f} name="country" label={t.country} required autoComplete="country-name" />
      <SelectField
        formId={f}
        name="lot"
        label={t.lot}
        hint={t.lotHint}
        placeholder={t.lotPlaceholder}
        prefillParam="lot"
        options={options}
      />
      <SelectField
        formId={f}
        name="volume"
        label={t.volume}
        placeholder={t.volumePlaceholder}
        options={Object.entries(t.volumes).map(([value, label]) => ({ value, label }))}
      />
      <TextArea formId={f} name="address" label={t.address} hint={t.addressHint} required rows={3} />
      <TextArea formId={f} name="message" label={t.message} hint={t.messageHint} rows={3} />
    </FormShell>
  );
}
