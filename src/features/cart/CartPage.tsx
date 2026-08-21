"use client";

import Link from "next/link";
import { brainrots } from "@/data/brainrots";
import { sellableTeeSizes } from "@/data/fulfillment";
import { formatEur, shippingNote, teePriceCents } from "@/data/pricing";
import { colorsForBrainrot } from "@/data/productAssets";
import { defaultProduct, products } from "@/data/products";
import { isTeeSize } from "@/data/sizes";
import { isTeeColor, teeColorLabel } from "@/data/teeColors";
import { useCart } from "@/features/cart/CartProvider";
import { TeeMockup } from "@/features/generator/TeeMockup";
import { ColorSwatches } from "@/features/product/ColorSwatches";
import { teePageHref } from "@/features/product/teeSize";
import { SiteFooter } from "@/shared/components/layout/SiteFooter";
import { SiteNav } from "@/shared/components/layout/SiteNav";

export function CartPage() {
  const { items, removeItem, setQuantity, setSize, setColor } = useCart();
  const sizes = sellableTeeSizes();
  const totalCents = items.reduce(
    (sum, item) => sum + item.quantity * teePriceCents,
    0,
  );

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteNav />
      <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
        <h1 className="font-display text-[clamp(1.8rem,5vw,3rem)] font-bold uppercase leading-none text-ink">
          Panier
        </h1>

        {items.length === 0 ? (
          <div className="mt-6 rounded-2xl border-[3px] border-ink bg-white px-4 py-10 text-center shadow-sticker-sm">
            <p className="font-display text-lg font-bold uppercase text-ink">
              Panier vide
            </p>
            <p className="mt-1 text-sm font-bold text-ink/60">
              Choisis un Brainrototo et porte-le sur un tee.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Link
                href="/create"
                className="inline-flex items-center justify-center rounded-pill border-[3px] border-ink bg-hot-pink px-6 py-3 font-display text-sm font-bold uppercase tracking-tight text-white shadow-sticker"
              >
                Choisir un tee →
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

            <div className="mt-6 rounded-2xl border-[3px] border-ink bg-white p-4 shadow-sticker-sm">
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-display text-base font-bold uppercase text-ink">
                  Total
                </p>
                <p className="font-display text-xl font-bold uppercase text-ink">
                  {formatEur(totalCents)} TTC
                </p>
              </div>
              <p className="mt-1 text-sm font-bold text-ink/55">
                {shippingNote} · {formatEur(teePriceCents)} le tee
              </p>
            </div>

            <Link
              href="/checkout"
              className="mt-4 inline-flex w-full items-center justify-center rounded-pill border-[3px] border-ink bg-hot-pink px-6 py-3 font-display text-sm font-bold uppercase tracking-tight text-white shadow-sticker"
            >
              Commander →
            </Link>
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
