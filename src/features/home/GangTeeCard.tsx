"use client";

import { useState } from "react";
import Link from "next/link";
import { sellableTeeSizes } from "@/data/fulfillment";
import { colorsForBrainrot } from "@/data/productAssets";
import { defaultProduct } from "@/data/products";
import { defaultTeeColor, type TeeColorId } from "@/data/teeColors";
import type { TeeSize } from "@/data/sizes";
import { useCart } from "@/features/cart/CartProvider";
import { TeeMockup } from "@/features/generator/TeeMockup";
import { ColorSwatches } from "@/features/product/ColorSwatches";
import { SizeGuideDialog } from "@/features/product/SizeGuide";
import { teePageHref } from "@/features/product/teeSize";
import { Button } from "@/shared/components/ui";
import type { Brainrototo } from "@/models";

export function GangTeeCard({ brainrot }: { brainrot: Brainrototo }) {
  const { addItem } = useCart();
  const palette = colorsForBrainrot(brainrot);
  const [size, setSize] = useState<TeeSize>("M");
  const [color, setColor] = useState<TeeColorId>(
    palette[0] ?? defaultTeeColor,
  );
  const resolvedColor = palette.includes(color)
    ? color
    : palette[0] ?? defaultTeeColor;
  const [justAdded, setJustAdded] = useState(false);
  const detailsHref = teePageHref(brainrot.id, size, resolvedColor);

  function handleAdd() {
    addItem(brainrot.id, defaultProduct.id, size, resolvedColor);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1600);
  }

  return (
    <div className="flex h-full flex-col rounded-2xl border-[3px] border-ink bg-white p-3 shadow-sticker sm:p-4 lg:p-5">
      <h3 className="font-display text-lg font-bold uppercase leading-none tracking-[-0.03em] text-ink sm:text-xl lg:text-2xl">
        <Link href={detailsHref} className="hover:text-hot-pink">
          {brainrot.name}
        </Link>
      </h3>

      <Link
        href={detailsHref}
        className="mt-3 flex justify-center lg:mt-4"
        aria-label={`Voir ${brainrot.name}`}
      >
        <TeeMockup
          product={defaultProduct}
          brainrot={brainrot}
          color={resolvedColor}
          className="max-w-[10rem] sm:max-w-[11rem] lg:max-w-[13rem] xl:max-w-[14rem]"
        />
      </Link>

      <div className="mt-auto flex flex-col pt-3">
        <ColorSwatches
          colors={palette}
          value={resolvedColor}
          onChange={setColor}
        />

        <div className="mt-3 flex items-baseline justify-between gap-3">
          <p className="font-display text-sm font-bold uppercase text-ink">
            Taille
          </p>
          <SizeGuideDialog />
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {sellableTeeSizes().map((value) => (
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

        <Button className="mt-3 w-full" onClick={handleAdd}>
          {justAdded ? "Ajouté ✓" : "Ajouter au panier"}
        </Button>
        {justAdded ? (
          <Link
            href="/cart"
            className="mt-2 inline-flex w-full justify-center font-display text-sm font-bold uppercase text-hot-pink underline decoration-2 underline-offset-2"
          >
            Voir le panier →
          </Link>
        ) : null}
      </div>
    </div>
  );
}
