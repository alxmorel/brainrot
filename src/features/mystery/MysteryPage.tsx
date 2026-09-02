"use client";

import Image from "next/image";
import Link from "next/link";
import { brand } from "@/data/brand";
import { gelatoTee, sellableTeeSizes } from "@/data/fulfillment";
import { legal } from "@/data/legal";
import { mysteryPool } from "@/data/mystery";
import {
  formatEur,
  mysteryLegalNote,
  shippingNote,
} from "@/data/pricing";
import { useShop } from "@/features/shop/ShopProvider";
import type { TeeSize } from "@/data/sizes";
import { teeColorIds, type TeeColorId } from "@/data/teeColors";
import { MysteryMockup } from "@/features/mystery/MysteryMockup";
import { useMysteryBuy } from "@/features/mystery/useMysteryBuy";
import { ColorSwatches } from "@/features/product/ColorSwatches";
import { SizeGuideDialog } from "@/features/product/SizeGuide";
import { ComposeLink } from "@/shared/components/layout/ComposeLink";
import { SiteFooter } from "@/shared/components/layout/SiteFooter";
import { SiteNav } from "@/shared/components/layout/SiteNav";
import { Button, PriceTag } from "@/shared/components/ui";

const specCards = [
  { label: "Matière", value: gelatoTee.fabric },
  { label: "Grammage", value: gelatoTee.weight },
  { label: "Coupe", value: gelatoTee.fit },
  { label: "Col", value: gelatoTee.neck },
  { label: "Impression", value: gelatoTee.print },
  { label: "Entretien", value: gelatoTee.care },
] as const;

export function MysteryPage({
  initialSize,
  initialColor,
}: {
  initialSize?: TeeSize;
  initialColor?: TeeColorId;
}) {
  const shop = useShop();
  const sizes = sellableTeeSizes();
  const pool = mysteryPool();
  const { size, setSize, color, setColor, buy, add, pending, error, justAdded } =
    useMysteryBuy(initialSize, initialColor);

  return (
    <div className="flex min-h-dvh flex-col" data-cart-source>
      <SiteNav />
      <main className="mx-auto w-full max-w-[1100px] flex-1 px-4 py-6 pb-28 sm:px-6 sm:pb-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-wide text-ink/55">
          <ComposeLink cta="bande" source="mystery" className="hover:text-hot-pink">
            La bande
          </ComposeLink>
          <span aria-hidden> / </span>
          {brand.mystery.name}
        </p>

        <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
          <div className="rounded-2xl border-[3px] border-ink bg-sunset p-4 shadow-sticker-sm sm:p-8">
            <MysteryMockup className="max-w-[22rem]" />
          </div>

          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-wide text-hot-pink">
              {brand.mystery.eyebrow}
            </p>
            <h1 className="mt-1 font-display text-[clamp(1.8rem,4vw,2.8rem)] font-bold uppercase leading-[0.9] tracking-[-0.04em] text-ink">
              {brand.mystery.name}
            </h1>
            <p className="mt-2 font-display text-sm font-bold uppercase tracking-tight text-ink/70">
              {brand.mystery.pitch}
            </p>
            <p className="mt-2 font-display text-lg font-bold uppercase text-ink">
              <PriceTag
                cents={shop.mysteryTeePriceCents}
                compareCents={shop.teePriceCents}
              />
            </p>
            <p className="mt-1 text-sm font-bold text-ink/70">
              {shippingNote} · {legal.deliveryEstimate}
            </p>
            <p className="mt-3 text-sm font-bold leading-snug text-ink/75">
              {brand.mystery.lead}
            </p>

            <div className="mt-5">
              <ColorSwatches
                colors={[...teeColorIds]}
                value={color}
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

            <div className="mt-5 hidden flex-col gap-2 lg:flex">
              <Button disabled={pending} onClick={buy}>
                {pending
                  ? "Redirection…"
                  : `${brand.mystery.cta} ${formatEur(shop.mysteryTeePriceCents)}`}
              </Button>
              <Button variant="ghost" disabled={pending} onClick={add}>
                {justAdded ? "Ajouté ✓" : brand.mystery.add}
              </Button>
            </div>
            {justAdded ? (
              <Link
                href="/cart"
                className="mt-2 hidden font-display text-sm font-bold uppercase text-hot-pink underline decoration-2 underline-offset-2 lg:inline-flex"
              >
                Voir le panier →
              </Link>
            ) : null}
            {error ? (
              <p className="mt-2 hidden text-sm font-bold text-hot-pink lg:block">
                {error}
              </p>
            ) : null}
            <p className="mt-3 text-xs font-bold leading-snug text-ink/55">
              {mysteryLegalNote}{" "}
              <Link href="/cgv" className="underline hover:text-hot-pink">
                CGV
              </Link>
            </p>

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
          </div>
        </div>

        <section className="mt-10">
          <h2 className="font-display text-lg font-bold uppercase text-ink sm:text-xl">
            {brand.mystery.poolLabel}
          </h2>
          <p className="mt-1 text-sm font-bold text-ink/60">
            Un visuel de la bande, tiré au sort.
          </p>
          <ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 lg:grid-cols-6">
            {pool.map((brainrot) => (
              <li
                key={brainrot.id}
                className="overflow-hidden rounded-xl border-[3px] border-ink bg-white shadow-sticker-sm"
              >
                <Image
                  src={brainrot.image}
                  alt={brainrot.name}
                  width={200}
                  height={200}
                  sizes="120px"
                  className="h-auto w-full"
                />
                <p className="px-1.5 py-1 text-center font-display text-[0.58rem] font-bold uppercase leading-tight text-ink sm:text-[0.65rem]">
                  {brainrot.name}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <div className="fixed inset-x-3 bottom-3 z-30 lg:hidden">
        <div className="rounded-2xl border-[3px] border-ink bg-white p-3 shadow-sticker">
          <Button className="w-full" disabled={pending} onClick={buy}>
            {pending
              ? "Redirection…"
              : `${brand.mystery.cta} ${formatEur(shop.mysteryTeePriceCents)}`}
          </Button>
          <Button
            variant="ghost"
            className="mt-2 w-full"
            disabled={pending}
            onClick={add}
          >
            {justAdded ? "Ajouté ✓" : brand.mystery.add}
          </Button>
          {justAdded ? (
            <Link
              href="/cart"
              className="mt-2 inline-flex w-full justify-center font-display text-xs font-bold uppercase text-hot-pink underline decoration-2 underline-offset-2"
            >
              Voir le panier →
            </Link>
          ) : null}
          {error ? (
            <p className="mt-2 text-center text-xs font-bold text-hot-pink">
              {error}
            </p>
          ) : null}
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
