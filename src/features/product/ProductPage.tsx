"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { brand, rarityLabel } from "@/data/brand";
import { gelatoTee, sellableTeeSizes } from "@/data/fulfillment";
import { legal } from "@/data/legal";
import {
  customProductLegalNote,
  formatEur,
  shippingNote,
} from "@/data/pricing";
import { useShop } from "@/features/shop/ShopProvider";
import { colorsForBrainrot, galleryFor } from "@/data/productAssets";
import { defaultProduct } from "@/data/products";
import type { TeeSize } from "@/data/sizes";
import { defaultTeeColor, type TeeColorId } from "@/data/teeColors";
import { comboLine } from "@/data/traits";
import { useCart } from "@/features/cart/CartProvider";
import { flyToCart } from "@/features/cart/flyToCart";
import { TeeMockup } from "@/features/generator/TeeMockup";
import { HomeBestsellers } from "@/features/home/HomeBestsellers";
import { ColorSwatches } from "@/features/product/ColorSwatches";
import { SizeGuideDialog } from "@/features/product/SizeGuide";
import {
  createPageHref,
  useTeeColor,
  useTeeSize,
} from "@/features/product/teeSize";
import { ComposeLink } from "@/shared/components/layout/ComposeLink";
import { SiteFooter } from "@/shared/components/layout/SiteFooter";
import { SiteNav } from "@/shared/components/layout/SiteNav";
import { Button, PriceTag } from "@/shared/components/ui";
import type { Brainrototo } from "@/models";

const specCards = [
  { label: "Matière", value: gelatoTee.fabric },
  { label: "Grammage", value: gelatoTee.weight },
  { label: "Coupe", value: gelatoTee.fit },
  { label: "Col", value: gelatoTee.neck },
  { label: "Impression", value: gelatoTee.print },
  { label: "Entretien", value: gelatoTee.care },
] as const;

export function ProductPage({
  brainrot,
  gang,
  initialSize,
  initialColor,
}: {
  brainrot: Brainrototo;
  gang: Brainrototo[];
  initialSize?: TeeSize;
  initialColor?: TeeColorId;
}) {
  const { addItem } = useCart();
  const shop = useShop();
  const sizes = sellableTeeSizes();
  const palette = colorsForBrainrot(brainrot);
  const [size, setSize] = useTeeSize(initialSize);
  const [color, setColor] = useTeeColor(initialColor);
  const resolvedColor = palette.includes(color) ? color : palette[0] ?? defaultTeeColor;
  const [justAdded, setJustAdded] = useState(false);
  const shots = galleryFor(brainrot, resolvedColor);
  const [shotIndex, setShotIndex] = useState(0);
  const shot = shots[shotIndex] ?? null;
  const [zoomOpen, setZoomOpen] = useState(false);

  useEffect(() => {
    setShotIndex(0);
  }, [resolvedColor, brainrot.id]);

  function handleAdd(event: { currentTarget: EventTarget }) {
    addItem(brainrot.id, defaultProduct.id, size, resolvedColor);
    flyToCart(event.currentTarget);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1600);
  }

  return (
    <div className="flex min-h-dvh flex-col" data-cart-source>
      <SiteNav />
      <main className="mx-auto w-full max-w-[1100px] flex-1 px-4 py-6 pb-28 sm:px-6 sm:pb-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-wide text-ink/55">
          <ComposeLink cta="bande" source="product" className="hover:text-hot-pink">
            La bande
          </ComposeLink>
          <span aria-hidden> / </span>
          {brainrot.name}
        </p>

        <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
          <div>
            {shot ? (
              <>
                <button
                  type="button"
                  onClick={() => setZoomOpen(true)}
                  className="w-full overflow-hidden rounded-2xl border-[3px] border-ink bg-white shadow-sticker-sm transition-[transform,box-shadow] duration-[var(--duration-card)] hover:-translate-y-0.5 hover:shadow-sticker"
                  aria-label="Agrandir le mockup"
                  data-cart-fly
                >
                  <Image
                    key={shot}
                    src={shot}
                    alt={brainrot.name}
                    width={900}
                    height={900}
                    sizes="(max-width: 1024px) 100vw, 640px"
                    className="h-auto w-full"
                  />
                </button>
                {shots.length > 1 ? (
                  <ul className="mt-3 grid grid-cols-6 gap-1.5">
                    {shots.map((src, index) => (
                      <li key={src}>
                        <button
                          type="button"
                          onClick={() => setShotIndex(index)}
                          aria-pressed={shotIndex === index}
                          className={
                            shotIndex === index
                              ? "overflow-hidden rounded-lg border-[3px] border-ink shadow-sticker-sm"
                              : "overflow-hidden rounded-lg border-[3px] border-ink/30"
                          }
                        >
                          <Image
                            src={src}
                            alt=""
                            width={120}
                            height={120}
                            sizes="80px"
                            className="h-auto w-full"
                          />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <p className="mt-2 text-center text-xs font-bold uppercase text-ink/45">
                  Cliquer pour zoomer
                </p>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setZoomOpen(true)}
                  className="w-full rounded-2xl border-[3px] border-ink bg-sunset p-4 shadow-sticker-sm transition-[transform,box-shadow] duration-[var(--duration-card)] hover:-translate-y-0.5 hover:shadow-sticker sm:p-8"
                  aria-label="Agrandir le mockup"
                >
                  <TeeMockup
                    product={defaultProduct}
                    brainrot={brainrot}
                    color={resolvedColor}
                    className="max-w-[22rem]"
                  />
                </button>
                <p className="mt-2 text-center text-xs font-bold uppercase text-ink/45">
                  Cliquer pour zoomer
                </p>
              </>
            )}
          </div>

          <div>
            <h1 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] font-bold uppercase leading-[0.9] tracking-[-0.04em] text-ink">
              {brainrot.name}
            </h1>
            <p className="mt-2 font-display text-sm font-bold uppercase tracking-tight text-ink/70">
              {comboLine(brainrot)}
              {brainrot.rarity ? ` · ${rarityLabel[brainrot.rarity]}` : null}
            </p>
            <p className="mt-2 font-display text-lg font-bold uppercase text-ink">
              <PriceTag />
            </p>
            <p className="mt-1 text-sm font-bold text-ink/70">
              {shippingNote} · {legal.deliveryEstimate}
            </p>

            <div className="mt-5">
              <ColorSwatches
                colors={palette}
                value={resolvedColor}
                onChange={setColor}
              />
            </div>

            <div className="mt-5">
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-display text-sm font-bold uppercase text-ink">
                  Taille
                </p>
                <SizeGuideDialog />
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {sizes.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setSize(value)}
                    className={
                      size === value
                        ? "rounded-pill border-[3px] border-ink bg-acid-yellow px-2.5 py-1 font-display text-xs font-bold uppercase shadow-sticker-sm"
                        : "rounded-pill border-[3px] border-ink bg-white px-2.5 py-1 font-display text-xs font-bold uppercase text-ink/70"
                    }
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <Button className="mt-5 hidden w-full lg:inline-flex" onClick={handleAdd}>
              {justAdded ? "Ajouté ✓" : "Ajouter au panier"}
            </Button>
            {justAdded ? (
              <Link
                href="/cart"
                className="mt-2 hidden w-full justify-center font-display text-sm font-bold uppercase text-hot-pink underline decoration-2 underline-offset-2 lg:inline-flex"
              >
                Voir le panier →
              </Link>
            ) : null}
            <p className="mt-3 text-xs font-bold leading-snug text-ink/55">
              {customProductLegalNote}
            </p>
            <Link
              href="/mystery"
              className="mt-4 inline-flex font-display text-sm font-bold uppercase tracking-tight text-ink underline decoration-2 underline-offset-2 hover:text-hot-pink"
            >
              {brand.mystery.name} →
            </Link>

            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {specCards.map((spec) => (
                <div
                  key={spec.label}
                  className="rounded-xl border-[3px] border-ink bg-white px-3 py-2 shadow-sticker-sm"
                >
                  <p className="font-display text-[0.6rem] font-bold uppercase text-ink/45 sm:text-[0.65rem]">
                    {spec.label}
                  </p>
                  <p className="mt-0.5 text-xs font-bold leading-snug text-ink sm:text-sm">
                    {spec.value}
                  </p>
                </div>
              ))}
            </div>

            <Link
              href={createPageHref(null, size, resolvedColor)}
              className="mt-6 inline-flex font-display text-sm font-bold uppercase tracking-tight text-ink underline decoration-2 underline-offset-2 hover:text-hot-pink"
            >
              {brand.product.explore}
            </Link>
          </div>
        </div>
      </main>

      <div className="pb-28 sm:pb-0">
        <HomeBestsellers items={gang} />
      </div>

      <div className="fixed inset-x-3 bottom-3 z-30 lg:hidden">
        <div className="rounded-2xl border-[3px] border-ink bg-white p-3 shadow-sticker">
          <Button className="w-full" onClick={handleAdd}>
            {justAdded ? "Ajouté ✓" : `Ajouter · ${formatEur(shop.teePriceCents)} TTC`}
          </Button>
          {justAdded ? (
            <Link
              href="/cart"
              className="mt-2 inline-flex w-full justify-center font-display text-xs font-bold uppercase text-hot-pink underline decoration-2 underline-offset-2"
            >
              Voir le panier →
            </Link>
          ) : null}
        </div>
      </div>

      {zoomOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Zoom mockup"
          onClick={() => setZoomOpen(false)}
        >
          <div
            className="relative max-h-[90dvh] w-full max-w-lg rounded-2xl border-[3px] border-ink bg-sunset p-6 shadow-sticker"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setZoomOpen(false)}
              className="absolute right-3 top-3 rounded-pill border-[3px] border-ink bg-white px-2 py-1 font-display text-xs font-bold uppercase"
            >
              Fermer
            </button>
            {shot ? (
              <Image
                key={shot}
                src={shot}
                alt={brainrot.name}
                width={900}
                height={900}
                sizes="(max-width: 512px) 100vw, 512px"
                className="h-auto w-full"
              />
            ) : (
              <TeeMockup
                product={defaultProduct}
                brainrot={brainrot}
                color={resolvedColor}
                className="max-w-none"
              />
            )}
          </div>
        </div>
      ) : null}

      <SiteFooter />
    </div>
  );
}
