"use client";

import { useState } from "react";
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
import { colorsForBrainrot } from "@/data/productAssets";
import { defaultProduct } from "@/data/products";
import type { TeeSize } from "@/data/sizes";
import { defaultTeeColor, type TeeColorId } from "@/data/teeColors";
import { comboLine } from "@/data/traits";
import { useCart } from "@/features/cart/CartProvider";
import { flyToCart } from "@/features/cart/flyToCart";
import { HomeBestsellers } from "@/features/home/HomeBestsellers";
import { ColorSwatches } from "@/features/product/ColorSwatches";
import { ProductGallery } from "@/features/product/ProductGallery";
import { SizeGuideDialog } from "@/features/product/SizeGuide";
import {
  createPageHref,
  useTeeColor,
  useTeeSize,
} from "@/features/product/teeSize";
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

  function handleAdd(event: { currentTarget: EventTarget }) {
    addItem(brainrot.id, defaultProduct.id, size, resolvedColor);
    flyToCart(event.currentTarget);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1600);
  }

  return (
    <div className="flex min-h-dvh min-w-0 flex-col" data-cart-source>
      <SiteNav />
      <main className="mx-auto w-full min-w-0 max-w-[1100px] flex-1 px-4 py-5 pb-28 sm:px-6 sm:py-6 sm:pb-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-wide text-ink/55">
          <a href="#bande" className="hover:text-hot-pink">
            {brand.gang.title}
          </a>
          <span aria-hidden> / </span>
          {brainrot.name}
        </p>

        <div className="mt-5 grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
          <ProductGallery brainrot={brainrot} color={resolvedColor} />

          <div>
            <h1 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] font-bold uppercase leading-[0.9] tracking-[-0.04em] text-ink">
              {brainrot.name}
            </h1>
            <p className="mt-2 font-display text-sm font-bold uppercase tracking-tight text-ink/70">
              {comboLine(brainrot)}
              {brainrot.rarity ? ` · ${rarityLabel[brainrot.rarity]}` : null}
            </p>
            <p className="mt-1.5 text-sm font-bold leading-snug text-ink/65">
              {brand.product.blurb}
            </p>
            <p className="mt-3 font-display text-xl font-bold uppercase text-ink sm:text-2xl">
              <PriceTag />
            </p>

            <div className="mt-5">
              <ColorSwatches
                colors={palette}
                value={resolvedColor}
                onChange={setColor}
                alwaysShow
              />
            </div>

            <div className="mt-4">
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

            <p className="mt-3 text-xs font-bold leading-snug text-ink/50">
              {shippingNote} · {legal.deliveryEstimate}
            </p>
            <p className="mt-1 text-xs font-bold leading-snug text-ink/45">
              {customProductLegalNote}
            </p>

            <dl
              aria-label="Caractéristiques"
              className="mt-6 grid grid-cols-1 gap-x-6 gap-y-3 border-t border-ink/15 pt-4 sm:grid-cols-2"
            >
              {specCards.map((spec) => (
                <div key={spec.label}>
                  <dt className="text-xs font-bold uppercase tracking-wide text-ink/50">
                    {spec.label}
                  </dt>
                  <dd className="mt-0.5 text-sm font-semibold leading-snug text-ink/80">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </main>

      <div className="pb-28 sm:pb-0">
        <HomeBestsellers
          items={gang}
          compact
          extra={
            <>
              <Link
                href="/mystery"
                className="inline-flex items-center rounded-pill border-[3px] border-ink bg-white px-3 py-1.5 font-display text-xs font-bold uppercase shadow-sticker-sm hover:bg-acid-yellow sm:text-sm"
              >
                {brand.mystery.discover}
              </Link>
              <Link
                href={createPageHref(null, size, resolvedColor)}
                className="inline-flex items-center rounded-pill border-[3px] border-ink bg-white px-3 py-1.5 font-display text-xs font-bold uppercase shadow-sticker-sm hover:bg-acid-yellow sm:text-sm"
              >
                {brand.product.explore}
              </Link>
            </>
          }
        />
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

      <SiteFooter />
    </div>
  );
}
