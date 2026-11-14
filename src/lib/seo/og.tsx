import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Open Graph card, 1200x630. Colours are the DESIGN.md front-matter tokens as literals because
 * ImageResponse cannot read CSS variables: primary #0B3D2A, accent #6FD13B, on-primary #FFFFFF,
 * on-primary-body #D6E6DB, on-primary-muted #9FC4AE, primary-raised #1F4C3B.
 * Fonts are Vollkorn SemiBold and SemiBold Italic instances (TTF, because Satori does not read WOFF2).
 */
export const ogSize = { width: 1200, height: 630 } as const;
export const ogContentType = "image/png";

const fonts = () =>
  Promise.all([
    readFile(join(process.cwd(), "src/lib/seo/fonts/Vollkorn-SemiBold.ttf")),
    readFile(join(process.cwd(), "src/lib/seo/fonts/Vollkorn-SemiBoldItalic.ttf")),
  ]);

export type OgCard = {
  eyebrow: string;
  /** Title parts: the `accent` word renders in italic lime. */
  title: string;
  accent?: string;
  /** Lines under the title (producer, farm, town, price, ...). */
  lines?: string[];
  /** Right-hand badge (price, code). */
  badge?: { label: string; value: string };
  footer: string;
};

function BeanMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <ellipse cx="16" cy="16" rx="9" ry="13" transform="rotate(35 16 16)" fill="#6FD13B" />
      <path d="M10 24 C 14 18, 18 14, 22 8" stroke="#0B3D2A" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export async function renderOg(card: OgCard) {
  const [regular, italic] = await fonts();
  const long = card.title.length + (card.accent?.length ?? 0) > 34;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0B3D2A",
          color: "#FFFFFF",
          padding: "64px 72px",
          fontFamily: "Vollkorn",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <BeanMark size={56} />
          <div style={{ fontSize: 28, color: "#9FC4AE", letterSpacing: 2, textTransform: "uppercase", display: "flex" }}>
            {card.eyebrow}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 48 }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                fontSize: long ? 72 : 92,
                lineHeight: 1.04,
                letterSpacing: -2,
                fontWeight: 600,
              }}
            >
              <span>{card.title}</span>
              {card.accent ? (
                <span style={{ color: "#6FD13B", fontStyle: "italic", marginLeft: 22 }}>{card.accent}</span>
              ) : null}
            </div>
            {card.lines?.length ? (
              <div style={{ display: "flex", flexDirection: "column", marginTop: 28, fontSize: 34, color: "#D6E6DB", gap: 6 }}>
                {card.lines.map((l) => (
                  <div key={l} style={{ display: "flex" }}>
                    {l}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          {card.badge ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                background: "#1F4C3B",
                borderRadius: 28,
                padding: "24px 32px",
              }}
            >
              <div style={{ display: "flex", fontSize: 24, color: "#9FC4AE" }}>{card.badge.label}</div>
              <div style={{ display: "flex", fontSize: 56, color: "#6FD13B", marginTop: 4 }}>{card.badge.value}</div>
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", fontSize: 26, color: "#9FC4AE" }}>{card.footer}</div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Vollkorn", data: regular, style: "normal", weight: 600 },
        { name: "Vollkorn", data: italic, style: "italic", weight: 600 },
      ],
    },
  );
}
