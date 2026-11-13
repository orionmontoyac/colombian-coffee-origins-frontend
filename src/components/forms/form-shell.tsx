"use client";

import Link from "next/link";
import { Fragment, createContext, useActionState, useContext, useEffect, useRef, type ReactNode } from "react";
import { idleState, type FormState } from "@/lib/actions/types";

export type FormStrings = {
  errors: Record<string, string>;
  summaryTitle: string;
  optional: string;
  consent: { before: string; link: string; after: string; label: string };
  submit: string;
  sending: string;
  honeypotLabel: string;
  success: { title: string; text: string };
};

type Ctx = {
  state: FormState;
  t: FormStrings;
  labels: Record<string, string>;
};
const FormCtx = createContext<Ctx | null>(null);
const useForm = () => {
  const c = useContext(FormCtx);
  if (!c) throw new Error("Field used outside FormShell");
  return c;
};

const inputBase =
  "w-full bg-neutral px-5 font-sans text-body-md text-ink ring-[1.5px] ring-inset ring-line placeholder:text-muted focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary aria-[invalid=true]:ring-error";

/**
 * One form: runs the Server Action through `useActionState`, so it also works without
 * JavaScript. Shows an error summary, moves focus to the first invalid field, and swaps
 * the form for a success message.
 */
export function FormShell({
  action,
  lang,
  t,
  labels,
  privacyHref,
  successExtra,
  children,
  formId,
}: {
  action: (prev: FormState, data: FormData) => Promise<FormState>;
  lang: string;
  t: FormStrings;
  /** field name -> visible label, for the error summary */
  labels: Record<string, string>;
  privacyHref: string;
  successExtra?: ReactNode;
  formId: string;
  children: ReactNode;
}) {
  const [state, formAction, pending] = useActionState(action, idleState);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.status === "error") {
      const first = state.order[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    } else if (state.status === "success") {
      successRef.current?.focus();
    }
  }, [state]);

  if (state.status === "success") {
    return (
      <div ref={successRef} tabIndex={-1} role="status" data-testid="form-success" className="outline-none">
        <h2 className="font-display text-headline-md text-primary">{t.success.title}</h2>
        <p className="mt-3 max-w-[60ch] text-body-lg text-body">{t.success.text}</p>
        {successExtra ? <div className="mt-6 flex flex-wrap gap-3">{successExtra}</div> : null}
      </div>
    );
  }

  const errors = state.status === "error" ? state.errors : {};
  const order = state.status === "error" ? state.order : [];

  return (
    <FormCtx.Provider value={{ state, t, labels }}>
      <form ref={formRef} id={formId} action={formAction} noValidate className="grid gap-5" data-testid={`${formId}-form`}>
        <input type="hidden" name="lang" value={lang} />
        {order.length ? (
          <div
            role="alert"
            data-testid="error-summary"
            className="rounded-lg bg-neutral p-5 ring-[1.5px] ring-inset ring-error"
          >
            <h2 className="font-display text-headline-sm text-error">{t.summaryTitle}</h2>
            <ul className="mt-2 grid gap-1 text-body-md">
              {order.map((name) => (
                <li key={name}>
                  <a href={`#${formId}-${name}`} className="text-error underline underline-offset-4">
                    {labels[name]}: {t.errors[errors[name]]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* Remount the fields after an error so they start from the submitted values. */}
        <Fragment key={state.status === "error" ? JSON.stringify(state.values) : "initial"}>{children}</Fragment>

        {/* Honeypot: hidden from people and assistive tech, bots fill it in. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor={`${formId}-website`}>{t.honeypotLabel}</label>
          <input id={`${formId}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
        </div>

        <ConsentField formId={formId} privacyHref={privacyHref} />

        <div>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-accent px-7 font-label text-base font-medium text-on-accent transition-colors duration-200 hover:bg-accent-hover focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? t.sending : t.submit}
          </button>
        </div>
      </form>
    </FormCtx.Provider>
  );
}

function ErrorText({ id, code }: { id: string; code?: string }) {
  const { t } = useForm();
  if (!code) return null;
  return (
    <p id={id} className="mt-1.5 text-body-sm text-error">
      {t.errors[code]}
    </p>
  );
}

function useFieldState(name: string) {
  const { state, t } = useForm();
  const code = state.status === "error" ? state.errors[name] : undefined;
  const value = state.status === "error" ? state.values[name] : undefined;
  const autoFocus = state.status === "error" && state.order[0] === name;
  return { code, value, autoFocus, t };
}

function Label({ htmlFor, children, required, optional }: { htmlFor: string; children: ReactNode; required?: boolean; optional: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block font-label text-label-md text-primary">
      {children}
      {required ? null : <span className="ml-2 font-sans text-body-sm font-normal text-muted">{optional}</span>}
    </label>
  );
}

type FieldProps = {
  formId: string;
  name: string;
  label: string;
  hint?: string;
  required?: boolean;
  defaultValue?: string;
};

export function TextField({
  formId,
  name,
  label,
  hint,
  required,
  defaultValue = "",
  type = "text",
  autoComplete,
}: FieldProps & { type?: "text" | "email" | "tel"; autoComplete?: string }) {
  const { code, value, autoFocus, t } = useFieldState(name);
  const id = `${formId}-${name}`;
  const describedBy = [hint ? `${id}-hint` : "", code ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <Label htmlFor={id} required={required} optional={t.optional}>{label}</Label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        defaultValue={value ?? defaultValue}
        aria-required={required || undefined}
        aria-invalid={code ? true : undefined}
        aria-describedby={describedBy}
        autoFocus={autoFocus}
        className={`${inputBase} min-h-[52px] rounded-full`}
      />
      {hint ? <p id={`${id}-hint`} className="mt-1.5 text-body-sm text-muted">{hint}</p> : null}
      <ErrorText id={`${id}-error`} code={code} />
    </div>
  );
}

export function TextArea({ formId, name, label, hint, required, defaultValue = "", rows = 5 }: FieldProps & { rows?: number }) {
  const { code, value, autoFocus, t } = useFieldState(name);
  const id = `${formId}-${name}`;
  const describedBy = [hint ? `${id}-hint` : "", code ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <Label htmlFor={id} required={required} optional={t.optional}>{label}</Label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        defaultValue={value ?? defaultValue}
        aria-required={required || undefined}
        aria-invalid={code ? true : undefined}
        aria-describedby={describedBy}
        autoFocus={autoFocus}
        className={`${inputBase} rounded-lg py-3.5`}
      />
      {hint ? <p id={`${id}-hint`} className="mt-1.5 text-body-sm text-muted">{hint}</p> : null}
      <ErrorText id={`${id}-error`} code={code} />
    </div>
  );
}

export function SelectField({
  formId,
  name,
  label,
  hint,
  required,
  defaultValue = "",
  placeholder,
  options,
  prefillParam,
}: FieldProps & {
  placeholder: string;
  options: { value: string; label: string }[];
  /** Query-string parameter that preselects an option (only values that exist in `options` are used) */
  prefillParam?: string;
}) {
  const { code, value, autoFocus, t } = useFieldState(name);
  const ref = useRef<HTMLSelectElement>(null);
  useEffect(() => {
    if (!prefillParam || value !== undefined) return;
    const wanted = new URLSearchParams(window.location.search).get(prefillParam)?.toUpperCase();
    const match = options.find((o) => o.value.toUpperCase() === wanted);
    if (match && ref.current) ref.current.value = match.value;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const id = `${formId}-${name}`;
  const describedBy = [hint ? `${id}-hint` : "", code ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <Label htmlFor={id} required={required} optional={t.optional}>{label}</Label>
      <select
        ref={ref}
        id={id}
        name={name}
        defaultValue={value ?? defaultValue}
        aria-required={required || undefined}
        aria-invalid={code ? true : undefined}
        aria-describedby={describedBy}
        autoFocus={autoFocus}
        className={`${inputBase} min-h-[52px] rounded-full`}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint ? <p id={`${id}-hint`} className="mt-1.5 text-body-sm text-muted">{hint}</p> : null}
      <ErrorText id={`${id}-error`} code={code} />
    </div>
  );
}

function ConsentField({ formId, privacyHref }: { formId: string; privacyHref: string }) {
  const { code, autoFocus, t } = useFieldState("consent");
  const id = `${formId}-consent`;
  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          id={id}
          name="consent"
          type="checkbox"
          value="yes"
          aria-required="true"
          aria-invalid={code ? true : undefined}
          aria-describedby={code ? `${id}-error` : undefined}
          autoFocus={autoFocus}
          className="mt-0.5 size-6 shrink-0 accent-primary focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary"
        />
        <label htmlFor={id} className="text-body-md text-body">
          {t.consent.before}
          <Link href={privacyHref} className="text-primary underline underline-offset-4">
            {t.consent.link}
          </Link>
          {t.consent.after}
        </label>
      </div>
      <ErrorText id={`${id}-error`} code={code} />
    </div>
  );
}
