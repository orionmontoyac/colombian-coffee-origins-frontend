"use client";

import { useEffect, useId, useRef } from "react";
import { Bean } from "@/components/ui/bean";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/lib/site";
import { useCart } from "./cart-context";
import { FREE_SHIPPING_COP } from "./constants";
import { fill, formatCop } from "./format";

const stepButton =
  "inline-flex size-11 items-center justify-center rounded-full border border-roast-line bg-neutral font-label text-lg text-roast-dark hover:bg-roast-surface focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-roast";

/** Order text for WhatsApp: greeting, one line per bag, totals and a prompt for delivery details. */
function buildOrderMessage(cart: ReturnType<typeof useCart>): string {
  const { copy, lines, lang, subtotal, shipping, total, grindLabels } = cart;
  const rows = lines.map(
    (l) =>
      `- ${fill(copy.message.line, {
        qty: l.qty,
        name: l.name,
        brand: l.product.brand,
        grind: grindLabels[l.grind],
        grams: l.grams,
        price: formatCop(l.lineTotal, lang),
      })}`,
  );
  return [
    copy.message.greeting,
    "",
    ...rows,
    "",
    fill(copy.message.subtotal, { amount: formatCop(subtotal, lang) }),
    fill(copy.message.shipping, { amount: shipping === 0 ? copy.shippingFree : formatCop(shipping, lang) }),
    fill(copy.message.total, { amount: formatCop(total, lang) }),
    "",
    copy.message.details,
  ].join("\n");
}

/**
 * Cart drawer on the right. A native modal <dialog>: the browser traps focus inside it, makes the
 * page inert, closes it on Escape and (with our opener bookkeeping) returns focus to the trigger.
 */
export function CartDrawer() {
  const cart = useCart();
  const { copy, lang, lines, count, subtotal, shipping, total, open, closeCart, setQty, remove, grindLabels } = cart;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Keep the page behind the drawer from scrolling while it is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = previous;
    };
  }, [open]);

  const remaining = Math.max(0, FREE_SHIPPING_COP - subtotal);
  const progress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_COP) * 100));
  const empty = lines.length === 0;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={closeCart}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeCart();
      }}
      data-testid="cart-drawer"
      className="fixed inset-y-0 right-0 m-0 ml-auto h-dvh max-h-none w-full max-w-[440px] overflow-hidden bg-neutral p-0 text-roast-dark backdrop:bg-roast-dark/60 sm:rounded-l-xl"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-4 border-b border-roast-line px-6 py-5">
          <div>
            <h2 id={titleId} className="font-display text-headline-md text-roast-dark">
              {copy.title}
            </h2>
            {!empty ? <p className="text-body-sm text-roast-body">{count === 1 ? copy.itemsCountOne : fill(copy.itemsCount, { count })}</p> : null}
            <p className="mt-1 text-body-sm text-roast-body" data-testid="cart-ships-note">{copy.shipsColombiaOnly}</p>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label={copy.close}
            className="inline-flex size-11 items-center justify-center rounded-full bg-roast-surface text-roast-dark hover:bg-roast-line focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-roast"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {empty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <Bean size={40} />
            <p className="font-display text-headline-sm text-roast-dark">{copy.emptyTitle}</p>
            <p className="max-w-[32ch] text-body-md text-roast-body">{copy.emptyText}</p>
            <Button variant="shop" size="md" onClick={closeCart}>
              {copy.emptyCta}
            </Button>
          </div>
        ) : (
          <>
            <div className="border-b border-roast-line bg-roast-surface px-6 py-4">
              <p className="text-body-sm font-semibold text-roast-dark" data-testid="free-shipping-text">
                {remaining > 0 ? fill(copy.freeProgress, { amount: formatCop(remaining, lang) }) : copy.freeReached}
              </p>
              <div
                role="progressbar"
                aria-label={copy.progressLabel}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
                className="mt-2 h-2 overflow-hidden rounded-full bg-roast-line"
              >
                <div className="h-full rounded-full bg-roast" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <ul className="flex-1 divide-y divide-roast-line overflow-y-auto px-6" aria-label={copy.title}>
              {lines.map((line) => (
                <li key={line.key} data-testid="cart-line" className="flex gap-4 py-5">
                  <span
                    aria-hidden="true"
                    className="flex h-[72px] w-14 flex-none items-center justify-center rounded-sm"
                    style={{ background: line.product.stage }}
                  >
                    <span className="h-12 w-8 rounded-t-[6px] rounded-b-[3px]" style={{ background: line.product.bag }} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-label text-xs font-medium uppercase tracking-[0.08em] text-roast">{line.product.brand}</p>
                    <p className="font-display text-headline-sm text-roast-dark">{line.name}</p>
                    <p className="text-body-sm text-roast-body">
                      {fill(copy.lineMeta, { grind: grindLabels[line.grind], grams: line.grams })}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <div className="inline-flex items-center gap-1" role="group" aria-label={fill(copy.quantity, { name: line.name })}>
                        <button type="button" className={stepButton} aria-label={fill(copy.decrease, { name: line.name })} onClick={() => setQty(line.key, line.qty - 1)}>
                          <span aria-hidden="true">−</span>
                        </button>
                        <span className="w-8 text-center font-label text-label-md" data-testid="cart-qty">
                          {line.qty}
                        </span>
                        <button type="button" className={stepButton} aria-label={fill(copy.increase, { name: line.name })} onClick={() => setQty(line.key, line.qty + 1)}>
                          <span aria-hidden="true">+</span>
                        </button>
                      </div>
                      <p className="font-display text-headline-sm text-roast-dark">{formatCop(line.lineTotal, lang)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(line.key)}
                      aria-label={fill(copy.remove, { name: line.name })}
                      className="mt-2 inline-flex min-h-11 items-center font-label text-label-md text-roast underline underline-offset-4 hover:text-roast-hover focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-roast"
                    >
                      {copy.removeShort}
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-roast-line bg-roast-surface px-6 pb-6 pt-5">
              <dl className="space-y-1.5 text-body-md text-roast-body">
                <div className="flex justify-between">
                  <dt>{copy.subtotal}</dt>
                  <dd data-testid="cart-subtotal" className="font-semibold text-roast-dark">
                    {formatCop(subtotal, lang)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt>{copy.shipping}</dt>
                  <dd>{shipping === 0 ? copy.shippingFree : formatCop(shipping, lang)}</dd>
                </div>
                <div className="flex justify-between border-t border-roast-line pt-2 font-display text-headline-sm text-roast-dark">
                  <dt>{copy.total}</dt>
                  <dd>{formatCop(total, lang)}</dd>
                </div>
              </dl>
              <a
                href={whatsappLink(buildOrderMessage(cart))}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="cart-checkout"
                className="mt-5 inline-flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-full bg-roast px-6 py-3.5 font-label text-base font-medium text-on-primary transition-colors duration-200 hover:bg-roast-hover focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-roast"
              >
                {copy.checkout}
              </a>
              <p className="mt-3 text-body-sm text-roast-body">{copy.checkoutHelp}</p>
              <p className="mt-1 text-body-sm font-semibold text-roast-dark">{copy.paymentsSoon}</p>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
