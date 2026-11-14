"use client";

import { SharedElement } from "@/components/motion/shared-element";
import { useState, type ReactNode } from "react";

export type GallerySlide = {
  /** Large view (an image or a labelled placeholder that fills its parent) */
  main: ReactNode;
  /** Thumbnail view */
  thumb: ReactNode;
  caption: string;
};

/**
 * Lot photo gallery: one large frame and a row of thumbnails. The frame carries
 * `data-vt-name` so the motion agent can morph the catalog card into it.
 */
export function LotGallery({
  slides,
  vtName,
  label,
  counterTemplate,
  thumbTemplate,
}: {
  slides: GallerySlide[];
  vtName: string;
  label: string;
  /** "{current} / {total}" */
  counterTemplate: string;
  /** "Show photo {n}: {caption}" */
  thumbTemplate: string;
}) {
  const [active, setActive] = useState(0);
  const slide = slides[active];
  const fill = (t: string, vars: Record<string, string | number>) =>
    t.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ""));

  return (
    <div role="group" aria-label={label}>
      <SharedElement name={vtName}>
      <div
        data-vt-name={vtName}
        className="relative h-[320px] overflow-hidden rounded-xl bg-placeholder sm:h-[440px] lg:h-[540px]"
      >
        {slide.main}
        <p
          aria-live="polite"
          className="absolute bottom-4 left-4 rounded-full bg-primary px-3.5 py-2 font-label text-label-caps text-on-primary sm:bottom-5 sm:left-5"
        >
          {fill(counterTemplate, { current: active + 1, total: slides.length })} · {slide.caption}
        </p>
      </div>
      </SharedElement>
      <ul className="mt-3 grid grid-cols-4 gap-3">
        {slides.map((s, i) => (
          <li key={s.caption + i}>
            <button
              type="button"
              aria-label={fill(thumbTemplate, { n: i + 1, caption: s.caption })}
              aria-pressed={i === active}
              onClick={() => setActive(i)}
              className={`relative block h-20 w-full overflow-hidden rounded-lg bg-placeholder outline-offset-3 focus-visible:outline-3 focus-visible:outline-primary sm:h-24 ${
                i === active ? "ring-[3px] ring-accent" : "ring-0 hover:opacity-90"
              }`}
            >
              {s.thumb}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
