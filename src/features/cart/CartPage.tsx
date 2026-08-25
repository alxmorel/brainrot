"use client";

import Link from "next/link";
import { useEffect } from "react";
import { brand } from "@/data/brand";
import { brainrots } from "@/data/brainrots";
import { sellableTeeSizes } from "@/data/fulfillment";
import { legal } from "@/data/legal";
import { formatEur, shippingNote, teePriceCents } from "@/data/pricing";
import { colorsForBrainrot } from "@/data/productAssets";
import { defaultProduct, products } from "@/data/products";
import { isTeeSize } from "@/data/sizes";
import { isTeeColor, teeColorLabel } from "@/data/teeColors";
import { CartReassurance } from "@/features/cart/CartReassurance";
import { CheckoutPayBlock } from "@/features/cart/CheckoutPayBlock";
import { CheckoutProgress } from "@/features/cart/CheckoutProgress";
import { useCart } from "@/features/cart/CartProvider";
import { useCheckoutPay } from "@/features/cart/useCheckoutPay";
import { TeeMockup } from "@/features/generator/TeeMockup";
import { ColorSwatches } from "@/features/product/ColorSwatches";
import { SizeGuideDialog } from "@/features/product/SizeGuide";
import { teePageHref } from "@/features/product/teeSize";
import { SiteFooter } from "@/shared/components/layout/SiteFooter";
import { SiteNav } from "@/shared/components/layout/SiteNav";
import { track } from "@/shared/utils/track";

export function CartPage() {
  const { items, removeItem, setQuantity, setSize, setColor } = useCart();
  const sizes = sellableTeeSizes();
  const { pay, error, totalCents, pending } = useCheckoutPay(items);

  useEffect(() => {
    track("view_cart", { items: items.length });
  }, [items.length]);

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteNav />
      <main className="mx-auto w-full max-w-3xl px-4 py-6 pb-28 sm:px-6 sm:pb-6">
        <CheckoutProgress step="cart" />

        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <h1 className="font-display text-[clamp(1.8rem,5vw,3rem)] font-bold uppercase leading-none text-ink">
            Panier
          </h1>
          <SizeGuideDialog />
        </div>

        {items.length === 0 ? (
          <div className="mt-6 rounded-2xl border-[3px] border-ink bg-white px-4 py-10 text-center shadow-sticker-sm">
            <p className="font-display text-lg font-bold uppercase text-ink">
              Panier vide
            </p>
            <p className="mt-1 text-sm font-bold text-ink/60">
              Compose un combo. Rejoins la bande.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Link
                href="/create"
                className="inline-flex items-center justify-center rounded-pill border-[3px] border-ink bg-hot-pink px-6 py-3 font-display text-sm font-bold uppercase tracking-tight text-white shadow-sticker"
              >
                {brand.hero.cta}
              </Link>
            </div>
          </div>
        ) : (
          <>
            <ul className="mt-6 flex flex-col gap-3">
              {items.map((item) => {
                const brainrot = brainrots.find((b) => b.id === item.brainrotId);
                const product = products.find((p) => p.id === item.productId);
                if (!brainrot || !product) return null;
                const lineCents = item.quantity * teePriceCents;
                const teeHref =
                  isTeeSize(item.size) && isTeeColor(item.color)
                    ? teePageHref(brainrot.id, item.size, item.color)
                    : isTeeSize(item.size)
                      ? teePageHref(brainrot.id, item.size)
                      : `/tee/${brainrot.id}`;
                return (
                  <li
                    key={item.id}
                    className="flex flex-col gap-3 rounded-2xl border-[3px] border-ink bg-white p-3 shadow-sticker-sm sm:flex-row sm:items-center"
                  >
                    <Link
                      href={teeHref}
                      className="relative mx-auto w-24 shrink-0 sm:mx-0 sm:w-28"
                    >
                      <TeeMockup
                        product={defaultProduct}
                        brainrot={brainrot}
                        color={item.color}
                        className="max-w-none"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={teeHref}
                        className="font-display text-lg font-bold leading-tight text-ink hover:text-hot-pink"
                      >
                        {brainrot.name}
                      </Link>
                      <p className="text-sm font-bold text-ink/60">
                        {product.name} · {teeColorLabel(item.color)} ·{" "}
                        {formatEur(teePriceCents)}
                      </p>
                      <div className="mt-2">
                        <ColorSwatches
                          colors={colorsForBrainrot(brainrot)}
                          value={
                            isTeeColor(item.color) ? item.color : "white"
                          }
                          onChange={(id) => setColor(item.id, id)}
                        />
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {sizes.map((value) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setSize(item.id, value)}
                            className={
                              item.size === value
                                ? "rounded-pill border-[3px] border-ink bg-acid-yellow px-2 py-0.5 font-display text-[0.65rem] font-bold uppercase shadow-sticker-sm"
                                : "rounded-pill border-[3px] border-ink bg-white px-2 py-0.5 font-display text-[0.65rem] font-bold uppercase text-ink/70"
                            }
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          aria-label="Moins"
                          onClick={() =>
                            setQuantity(item.id, item.quantity - 1)
                          }
                          className="inline-flex h-8 w-8 items-center justify-center rounded-pill border-[3px] border-ink bg-white font-display text-sm font-bold"
                        >
                          −
                        </button>
                        <span className="min-w-[1.5rem] text-center font-display text-sm font-bold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Plus"
                          onClick={() =>
                            setQuantity(item.id, item.quantity + 1)
                          }
                          className="inline-flex h-8 w-8 items-center justify-center rounded-pill border-[3px] border-ink bg-white font-display text-sm font-bold"
                        >
                          +
                        </button>
                        <span className="ml-auto font-display text-sm font-bold text-ink">
                          {formatEur(lineCents)}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="self-end font-display text-xs font-bold uppercase text-hot-pink sm:self-center"
                    >
                      Retirer
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="mt-4">
              <Link
                href="/create"
                className="font-display text-sm font-bold uppercase text-hot-pink underline decoration-2 underline-offset-2"
              >
                Continuer mes achats →
              </Link>
            </div>

            <div className="mt-6">
              <CartReassurance />
            </div>

            <div className="mt-4 rounded-2xl border-[3px] border-ink bg-white p-4 shadow-sticker-sm">
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-display text-base font-bold uppercase text-ink">
                  Total
                </p>
                <p className="font-display text-xl font-bold uppercase text-ink">
                  {formatEur(totalCents)} TTC
                </p>
              </div>
              <p className="mt-1 text-sm font-bold text-ink/55">
                {shippingNote} · {legal.deliveryEstimate}
              </p>
            </div>

            <div className="mt-4">
              <CheckoutPayBlock
                totalCents={totalCents}
                pending={pending}
                error={error}
                onPay={pay}
              />
            </div>
          </>
        )}
      </main>

      {items.length > 0 ? (
        <div className="fixed inset-x-3 bottom-3 z-30 lg:hidden">
          <div className="flex items-center justify-between gap-3 rounded-2xl border-[3px] border-ink bg-white p-3 shadow-sticker">
            <div>
              <p className="font-display text-xs font-bold uppercase text-ink/55">
                Total TTC
              </p>
              <p className="font-display text-lg font-bold uppercase text-ink">
                {formatEur(totalCents)}
              </p>
            </div>
            <a
              href="#paiement"
              className="inline-flex shrink-0 items-center justify-center rounded-pill border-[3px] border-ink bg-hot-pink px-5 py-2.5 font-display text-sm font-bold uppercase tracking-tight text-white shadow-sticker-sm"
            >
              Payer →
            </a>
          </div>
        </div>
      ) : null}

      <SiteFooter />
    </div>
  );
}
