"use client";

import { SubpageBanner, type SubpageBannerProps } from "@/components/ui/subpage-banner";
import { useCart } from "./cart-context";

/** The roasted-line sub-page banner with the header Cart button wired to the cart drawer. */
export function ShopBanner(props: Omit<SubpageBannerProps, "cart" | "line">) {
  const { count, openCart, copy } = useCart();
  return <SubpageBanner {...props} line="roasted" cart={{ count, onOpen: openCart, label: copy.open }} />;
}
