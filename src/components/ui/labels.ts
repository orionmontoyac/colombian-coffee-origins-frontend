import type { Locale } from "@/app/[lang]/dictionaries";

/**
 * Small UI strings the shared components need that are not in the dictionaries yet.
 * Pages may override them with props. Move into en.json / es.json when convenient.
 */
export const uiLabels: Record<
  Locale,
  { skipToContent: string; cart: string; closeMenu: string; breadcrumb: string; whatsapp: string; roast: string }
> = {
  en: {
    skipToContent: "Skip to main content",
    cart: "Cart",
    closeMenu: "Close menu",
    breadcrumb: "Breadcrumb",
    whatsapp: "Chat on WhatsApp",
    roast: "Roast level",
  },
  es: {
    skipToContent: "Saltar al contenido principal",
    cart: "Carrito",
    closeMenu: "Cerrar menú",
    breadcrumb: "Ruta de navegación",
    whatsapp: "Escríbenos por WhatsApp",
    roast: "Nivel de tueste",
  },
};
