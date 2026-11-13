import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import { Button } from "@/components/ui";
import { submitSell } from "@/lib/actions/forms";
import { href } from "@/lib/routes";
import { FormShell, SelectField, TextArea, TextField } from "./form-shell";
import { formStrings } from "./strings";

export function SellForm({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.forms.sell.form;
  const f = "sell";
  return (
    <FormShell
      formId={f}
      action={submitSell}
      lang={lang}
      t={formStrings(dict.forms, t)}
      labels={dict.forms.shared.labels}
      privacyHref={href(lang, "privacy")}
      successExtra={
        <Button href={href(lang, "producers")} variant="secondary">
          {dict.nav.producers}
        </Button>
      }
    >
      <h2 className="font-display text-headline-md text-primary">{t.title}</h2>
      <p className="-mt-3 text-body-md text-body">{t.text}</p>
      <TextField formId={f} name="name" label={t.name} required autoComplete="name" />
      <TextField formId={f} name="farm" label={t.farm} required autoComplete="organization" />
      <TextField formId={f} name="email" type="email" label={t.email} required autoComplete="email" />
      <TextField formId={f} name="phone" type="tel" label={t.phone} autoComplete="tel" />
      <TextField formId={f} name="region" label={t.region} hint={t.regionHint} required />
      <SelectField
        formId={f}
        name="way"
        label={t.way}
        required
        placeholder={t.wayPlaceholder}
        options={Object.entries(t.ways).map(([value, label]) => ({ value, label }))}
      />
      <TextField formId={f} name="volume" label={t.volume} hint={t.volumeHint} />
      <TextArea formId={f} name="message" label={t.message} hint={t.messageHint} rows={4} />
    </FormShell>
  );
}
