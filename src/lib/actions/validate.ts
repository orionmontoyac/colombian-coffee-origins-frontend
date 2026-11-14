import { lots } from "@/data/lots";
import type { ErrorCode, FormKind } from "./types";

type FieldRule = {
  name: string;
  required?: boolean;
  kind?: "email" | "lot" | "oneOf";
  options?: readonly string[];
  max: number;
};

export const topics = ["buying", "shop", "press", "other"] as const;
export const sellWays = ["green", "roasted", "both"] as const;
export const volumes = ["lt100", "100to500", "gt500", "unsure"] as const;

/** Field order here is the visual order in each form. */
export const rules: Record<FormKind, FieldRule[]> = {
  samples: [
    { name: "name", required: true, max: 100 },
    { name: "email", required: true, kind: "email", max: 160 },
    { name: "company", required: true, max: 120 },
    { name: "country", required: true, max: 80 },
    { name: "lot", kind: "lot", max: 20 },
    { name: "volume", kind: "oneOf", options: volumes, max: 20 },
    { name: "address", required: true, max: 400 },
    { name: "message", max: 1000 },
  ],
  contact: [
    { name: "name", required: true, max: 100 },
    { name: "email", required: true, kind: "email", max: 160 },
    { name: "topic", required: true, kind: "oneOf", options: topics, max: 20 },
    { name: "message", required: true, max: 2000 },
  ],
  sell: [
    { name: "name", required: true, max: 100 },
    { name: "farm", required: true, max: 120 },
    { name: "email", required: true, kind: "email", max: 160 },
    { name: "phone", max: 40 },
    { name: "region", required: true, max: 120 },
    { name: "way", required: true, kind: "oneOf", options: sellWays, max: 20 },
    { name: "volume", max: 120 },
    { name: "message", max: 1500 },
  ],
};

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const controlChars = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

function clean(raw: FormDataEntryValue | null): string {
  return typeof raw === "string" ? raw.replace(controlChars, "").trim() : "";
}

export type Validated =
  | { ok: true; values: Record<string, string> }
  | { ok: false; values: Record<string, string>; errors: Record<string, ErrorCode>; order: string[] };

/** Server-side validation. Never trust the client: every rule is checked again here. */
export function validate(kind: FormKind, data: FormData): Validated {
  const values: Record<string, string> = {};
  const errors: Record<string, ErrorCode> = {};
  const order: string[] = [];
  const fail = (name: string, code: ErrorCode) => {
    errors[name] = code;
    order.push(name);
  };

  for (const rule of rules[kind]) {
    const value = clean(data.get(rule.name));
    values[rule.name] = value;
    if (!value) {
      if (rule.required) fail(rule.name, "required");
      continue;
    }
    if (value.length > rule.max) fail(rule.name, "tooLong");
    else if (rule.kind === "email" && !emailRe.test(value)) fail(rule.name, "email");
    else if (rule.kind === "lot" && !lots.some((l) => l.code === value)) fail(rule.name, "invalid");
    else if (rule.kind === "oneOf" && !rule.options?.includes(value)) fail(rule.name, "invalid");
  }

  if (data.get("consent") !== "yes") fail("consent", "consent");
  return order.length ? { ok: false, values, errors, order } : { ok: true, values };
}
