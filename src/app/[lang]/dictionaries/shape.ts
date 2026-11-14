type Shape<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly Shape<U>[]
    : T extends object
      ? { [K in keyof T]: Shape<T[K]> }
      : T;

/** Resolves to `true` only when A and B have the same keys and value kinds (text may differ). */
export type AssertSameShape<A, B> = [Shape<A>] extends [Shape<B>]
  ? [Shape<B>] extends [Shape<A>]
    ? true
    : never
  : never;
