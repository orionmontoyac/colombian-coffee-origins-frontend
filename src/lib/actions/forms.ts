"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { href, type RouteKey } from "@/lib/routes";
import { deliver } from "./deliver";
import { idleState, type FormKind, type FormState } from "./types";
import { validate } from "./validate";

const ROUTE: Record<FormKind, RouteKey> = { samples: "samples", contact: "contact", sell: "sellWithUs" };

/** Same-origin path only. A posted Referer must not be able to send someone off-site. */
function returnPath(referer: string | null, lang: "en" | "es", kind: FormKind): { path: string; search: string } {
  const fallback = href(lang, ROUTE[kind]);
  if (!referer) return { path: fallback, search: "" };
  try {
    const url = new URL(referer);
    if (url.pathname === `/${lang}` || url.pathname.startsWith(`/${lang}/`)) {
      return { path: url.pathname, search: url.search };
    }
  } catch {
    /* ignore a malformed Referer */
  }
  return { path: fallback, search: "" };
}

function resultUrl(path: string, search: string, state: FormState): string {
  const params = new URLSearchParams(search);
  params.delete("sent");
  params.delete("error");
  if (state.status === "success") params.set("sent", "1");
  if (state.status === "error") params.set("error", state.order.map((name) => `${name}:${state.errors[name]}`).join(","));
  const q = params.toString();
  return q ? `${path}?${q}` : path;
}

async function handle(kind: FormKind, _prev: FormState, data: FormData): Promise<FormState> {
  const lang = data.get("lang") === "es" ? "es" : "en";
  let state: FormState = { status: "success" };
  // Honeypot: real people never see this field. Answer like a success so bots learn nothing.
  if (String(data.get("website") ?? "").trim() === "") {
    const result = validate(kind, data);
    if (!result.ok) {
      state = { status: "error", errors: result.errors, order: result.order, values: result.values };
    } else {
      await deliver(kind, result.values, lang);
    }
  }
  // A static page's action POST does not come back as HTML. A redirect does, with and without JS.
  const back = returnPath((await headers()).get("referer"), lang, kind);
  redirect(resultUrl(back.path, back.search, state));
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
