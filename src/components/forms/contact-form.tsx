import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import { Button } from "@/components/ui";
import { submitContact } from "@/lib/actions/forms";
import { href } from "@/lib/routes";
import { FormShell, SelectField, TextArea, TextField } from "./form-shell";
import { formStrings } from "./strings";

export function ContactForm({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.forms.contact.form;
  const f = "contact";
  return (
    <FormShell
      formId={f}
      action={submitContact}
      lang={lang}
      t={formStrings(dict.forms, t)}
      labels={dict.forms.shared.labels}
      privacyHref={href(lang, "privacy")}
      successExtra={
        <Button href={href(lang, "home")} variant="secondary">
          {dict.forms.shared.backHome}
        </Button>
      }
    >
      <h2 className="font-display text-headline-md text-primary">{t.title}</h2>
      <TextField formId={f} name="name" label={t.name} required autoComplete="name" />
      <TextField formId={f} name="email" type="email" label={t.email} required autoComplete="email" />
      <SelectField
        formId={f}
        name="topic"
        label={t.topic}
        required
        placeholder={t.topicPlaceholder}
        options={Object.entries(t.topics).map(([value, label]) => ({ value, label }))}
      />
      <TextArea formId={f} name="message" label={t.message} hint={t.messageHint} required rows={6} />
    </FormShell>
  );
}
