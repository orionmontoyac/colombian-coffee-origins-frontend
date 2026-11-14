import { ViewTransition, type ReactNode } from "react";

/** Names an element for a morph between pages (lot card image to gallery, bag to product page). */
export function SharedElement({ name, children }: { name: string; children: ReactNode }) {
  return (
    <ViewTransition name={name} share="morph" default="none">
      {children}
    </ViewTransition>
  );
}

/** Wraps a page's content so navigation crossfades (200ms). */
export function PageFade({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-fade" exit="page-fade" default="none">
      {children}
    </ViewTransition>
  );
}
