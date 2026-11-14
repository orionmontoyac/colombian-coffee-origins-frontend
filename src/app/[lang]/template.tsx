import type { ReactNode } from "react";
import { PageFade } from "@/components/motion/shared-element";

/** Crossfades route changes where the browser supports view transitions. */
export default function Template({ children }: { children: ReactNode }) {
  return <PageFade>{children}</PageFade>;
}
