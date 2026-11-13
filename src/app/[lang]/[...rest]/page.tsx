import { notFound } from "next/navigation";

/** Catch-all for unmatched URLs so they render the branded not-found page with a 404. */
export default function UnmatchedPage() {
  notFound();
}
