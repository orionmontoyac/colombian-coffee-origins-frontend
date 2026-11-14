import Image from "next/image";
import { cx } from "./cx";

/** The user's single coffee-bean icon (public/images). `tone="white"` is for dark surfaces. */
export function Bean({
  tone = "brown",
  size = 16,
  className,
  style,
}: {
  tone?: "brown" | "white";
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  // Source art is 240×318. Lock both axes: a flex row stretches an auto-height image
  // to the text block and the bean turns into a tall oval.
  const width = Math.round((size * 240) / 318);
  return (
    <Image
      src={tone === "brown" ? "/images/bean-brown.png" : "/images/bean-white.png"}
      alt=""
      aria-hidden="true"
      width={width}
      height={size}
      className={cx("flex-none", className)}
      style={{ width, height: size, ...style }}
    />
  );
}
