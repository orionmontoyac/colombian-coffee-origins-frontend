import type { FormKind } from "./types";

/**
 * Hand-off point for a validated submission.
 *
 * TODO(backend): store the request (Supabase) and notify the team (Resend email and/or WhatsApp).
 * Until then nothing leaves the server and nothing is logged, because the payload is personal data.
 * Also add rate limiting here (per IP and per email) when the backend exists.
 */
export async function deliver(kind: FormKind, payload: Record<string, string>, lang: "en" | "es"): Promise<void> {
  void kind;
  void payload;
  void lang;
}
