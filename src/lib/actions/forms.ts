"use server";

import { deliver } from "./deliver";
import { idleState, type FormKind, type FormState } from "./types";
import { validate } from "./validate";

async function handle(kind: FormKind, _prev: FormState, data: FormData): Promise<FormState> {
  // Honeypot: real people never see this field. Answer like a success so bots learn nothing,
  // and drop the submission before anything else runs.
  if (typeof data.get("website") === "string" && String(data.get("website")).trim() !== "") {
    return { status: "success" };
  }
  const result = validate(kind, data);
  if (!result.ok) {
    return { status: "error", errors: result.errors, order: result.order, values: result.values };
  }
  const lang = data.get("lang") === "es" ? "es" : "en";
  await deliver(kind, result.values, lang);
  return { status: "success" };
}

export async function submitSamples(prev: FormState = idleState, data: FormData) {
  return handle("samples", prev, data);
}
export async function submitContact(prev: FormState = idleState, data: FormData) {
  return handle("contact", prev, data);
}
export async function submitSell(prev: FormState = idleState, data: FormData) {
  return handle("sell", prev, data);
}
