import type { AssertSameShape } from "../shape";
import en from "./en.json";
import es from "./es.json";

// Build fails if es.json does not have the same shape as en.json.
export const sameShape: AssertSameShape<typeof en, typeof es> = true;
export { en, es };
