export type FormKind = "samples" | "contact" | "sell";

/** Error codes; the client maps them to translated messages in the `forms` dictionary. */
export type ErrorCode = "required" | "email" | "tooLong" | "invalid" | "consent";

export type FormState =
  | { status: "idle" }
  | { status: "success" }
  | {
      status: "error";
      errors: Record<string, ErrorCode>;
      /** Field names with errors, in form order (first one gets the focus) */
      order: string[];
      /** Submitted values, so the form keeps what the person typed */
      values: Record<string, string>;
    };

export const idleState: FormState = { status: "idle" };
