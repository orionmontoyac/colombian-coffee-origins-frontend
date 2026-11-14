import { idleState, type ErrorCode, type FormState } from "./types";

const CODES = new Set<ErrorCode>(["required", "email", "tooLong", "invalid", "consent"]);

type Search = Record<string, string | string[] | undefined>;

function one(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** `?sent=1` or `?error=name:required,email:email` from the no-JS redirect. */
export function stateFromSearch(sp: Search): FormState {
  if (one(sp.sent) === "1") return { status: "success" };
  const raw = one(sp.error);
  if (!raw) return idleState;
  const errors: Record<string, ErrorCode> = {};
  const order: string[] = [];
  for (const part of raw.split(",")) {
    const i = part.indexOf(":");
    if (i <= 0) continue;
    const name = part.slice(0, i);
    const code = part.slice(i + 1);
    if (!CODES.has(code as ErrorCode)) continue;
    errors[name] = code as ErrorCode;
    order.push(name);
  }
  return order.length ? { status: "error", errors, order, values: {} } : idleState;
}
