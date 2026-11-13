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
  // Source art is 240x318.
  return (
    <Image
      src={tone === "brown" ? "/images/bean-brown.png" : "/images/bean-white.png"}
      alt=""
      aria-hidden="true"
      width={Math.round((size * 240) / 318)}
      height={size}
      className={cx("flex-none", className)}
      style={style}
    />
  );
}
