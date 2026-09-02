"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { brand } from "@/data/brand";
import { sellableTeeSizes } from "@/data/fulfillment";
import { formatEur } from "@/data/pricing";
import { teeColorIds } from "@/data/teeColors";
import { useShop } from "@/features/shop/ShopProvider";
import { MysteryMockup } from "@/features/mystery/MysteryMockup";
import { useMysteryBuy } from "@/features/mystery/useMysteryBuy";
import { ColorSwatches } from "@/features/product/ColorSwatches";
import { SizeGuideDialog } from "@/features/product/SizeGuide";
import { MarkHighlight } from "@/shared/components/brand";
import { Button } from "@/shared/components/ui";

const easeOut = [0.22, 1, 0.36, 1] as const;

export function HomeMysteryTee() {
  const reduced = useReducedMotion();
  const shop = useShop();
  const sizes = sellableTeeSizes();
  const { size, setSize, color, setColor, buy, add, pending, error, justAdded } =
    useMysteryBuy();

  return (
    <section
      id="mystery"
      data-cart-source
      className="scroll-mt-[4.75rem] px-3 py-8 sm:px-6 sm:py-14 lg:px-10 lg:py-16 xl:px-12 xl:py-20"
    >
      <div className="mx-auto max-w-[1760px]">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: reduced ? 0.01 : 0.4, ease: easeOut }}
          className="grid overflow-hidden rounded-[1.6rem] border-[3px] border-ink bg-acid-yellow shadow-sticker lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-center"
        >
          <div className="p-5 sm:p-8 lg:p-10">
            <Link href="/mystery" className="block">
              <p className="text-[0.65rem] font-bold uppercase tracking-wide text-ink/70 sm:text-xs">
                {brand.mystery.eyebrow}
              </p>
              <h2 className="mt-1 font-display text-[clamp(1.8rem,5vw,3.6rem)] font-bold uppercase leading-none tracking-[-0.04em] text-ink">
                {brand.mystery.title}
              </h2>
              <p className="mt-3 max-w-xl font-display text-base font-bold uppercase leading-snug tracking-tight text-ink sm:text-lg lg:text-xl">
                {brand.mystery.pitch}{" "}
                <MarkHighlight rotate={-1}>
                  {formatEur(shop.mysteryTeePriceCents)}
                </MarkHighlight>
              </p>
              <p className="mt-3 max-w-lg text-sm font-bold leading-snug text-ink/75 sm:text-base">
                {brand.mystery.lead}
              </p>
            </Link>

            <div className="mt-5">
              <ColorSwatches
                colors={[...teeColorIds]}
                value={color}
                onChange={setColor}
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
                        ? "rounded-pill border-[3px] border-ink bg-white px-2.5 py-1 font-display text-xs font-bold uppercase shadow-sticker-sm"
                        : "rounded-pill border-[3px] border-ink bg-acid-yellow px-2.5 py-1 font-display text-xs font-bold uppercase text-ink/70"
                    }
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-stretch">
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
                className="mt-2 inline-flex font-display text-sm font-bold uppercase text-hot-pink underline decoration-2 underline-offset-2"
              >
                Voir le panier →
              </Link>
            ) : null}
            {error ? (
              <p className="mt-2 text-sm font-bold text-hot-pink">{error}</p>
            ) : null}
            <p className="mt-3 max-w-lg text-xs font-bold leading-snug text-ink/70">
              {brand.mystery.legal}{" "}
              <Link href="/cgv" className="underline hover:text-hot-pink">
                CGV
              </Link>
            </p>
          </div>
          <Link
            href="/mystery"
            className="flex justify-center px-6 pb-6 lg:px-8 lg:py-8"
            aria-label={`Voir ${brand.mystery.name}`}
          >
            <MysteryMockup className="max-w-[11rem] sm:max-w-[13rem] lg:max-w-[15rem]" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
