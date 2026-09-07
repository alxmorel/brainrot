"use client";

import { motion, useReducedMotion } from "motion/react";
import { brand } from "@/data/brand";
import { StickerLabel } from "@/features/home/HeroStickers";
import { ComposeLink } from "@/shared/components/layout/ComposeLink";
import { cn } from "@/shared/utils/cn";

const easeOut = [0.22, 1, 0.36, 1] as const;

/** Viewport minus nav (~4.75rem) minus promises bar so it stays in first paint. */
export const heroH =
  "lg:min-h-[calc(100dvh-4.75rem-6.25rem)] xl:min-h-[calc(100dvh-4.75rem-7.25rem)]";

const ctaClass =
  "inline-flex min-h-12 w-full items-center justify-center rounded-pill border-[3px] border-ink bg-hot-pink px-6 py-3.5 font-display text-base font-bold uppercase tracking-tight text-white shadow-sticker transition-[transform,box-shadow] duration-[var(--duration-button)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-sticker-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hot-pink focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffdf8] sm:min-h-14 sm:w-auto sm:px-8 sm:py-4 sm:text-lg lg:px-10 lg:py-5 lg:text-xl";

export function HeroCta({ className }: { className?: string }) {
  return (
    <ComposeLink
      cta="composer"
      source="hero"
      className={cn(ctaClass, className)}
    >
      {brand.hero.cta}
    </ComposeLink>
  );
}

export function HeroCopy() {
  const reduced = useReducedMotion();

  const fadeUp = {
    hidden: { opacity: 0, y: reduced ? 0 : 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0.01 : 0.36, ease: easeOut },
    },
  };

  const line = {
    hidden: { opacity: 0, y: reduced ? 0 : 28, rotate: reduced ? 0 : -4 },
    show: {
      opacity: 1,
      y: 0,
      rotate: -2,
      transition: { duration: reduced ? 0.01 : 0.4, ease: easeOut },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: reduced ? 0 : 0.08,
            delayChildren: reduced ? 0 : 0.06,
          },
        },
      }}
      className={[
        "pointer-events-none relative z-30 flex w-full flex-col",
        "gap-3 px-3 pt-4",
        "sm:max-w-md sm:gap-4 sm:px-6 sm:pb-[calc(28dvh+5rem)] sm:pt-8",
        `${heroH} lg:max-w-2xl lg:justify-center lg:gap-6 lg:px-8 lg:pb-16 lg:pt-8`,
        "xl:max-w-3xl xl:gap-7 xl:px-10 xl:pb-20",
        "2xl:max-w-[52rem]",
      ].join(" ")}
    >
      <motion.div variants={fadeUp}>
        <StickerLabel
          tone="yellow"
          className="pointer-events-auto w-fit rotate-[-4deg] lg:px-3.5 lg:py-1.5 lg:text-sm"
        >
          {brand.series}
        </StickerLabel>
      </motion.div>

      <motion.h1
        variants={{
          hidden: {},
          show: {
            transition: { staggerChildren: reduced ? 0 : 0.07 },
          },
        }}
        className="w-full font-display font-bold uppercase leading-[0.82] tracking-[-0.06em] text-[clamp(2.35rem,12.4vw,5.6rem)] sm:text-[clamp(1.7rem,8vw,5.6rem)] xl:text-[clamp(4.25rem,5.8vw,6.75rem)]"
      >
        <motion.span
          variants={line}
          className="text-sticker-stroke block whitespace-nowrap text-white"
        >
          {brand.hero.lines[0]}
        </motion.span>
        <motion.span
          variants={line}
          className="text-sticker-stroke mt-0.5 block whitespace-nowrap text-hot-pink sm:mt-1"
        >
          {brand.hero.lines[1]}
        </motion.span>
        <motion.span
          variants={line}
          className="text-sticker-stroke mt-0.5 block whitespace-nowrap text-white sm:mt-1"
        >
          {brand.hero.lines[2]}
        </motion.span>
      </motion.h1>

      <motion.p
        variants={fadeUp}
        className="w-fit max-w-full rotate-[-1.5deg] rounded-md border-[3px] border-ink bg-white px-2.5 py-1.5 font-display text-sm font-semibold uppercase leading-snug tracking-[-0.03em] text-ink shadow-sticker-sm sm:px-3 sm:py-2 sm:text-base sm:font-bold lg:px-3.5 lg:py-2 lg:text-xl xl:text-2xl"
      >
        {brand.hero.kicker}{" "}
        <span className="text-ultraviolet">100% Brainrototo.</span>
      </motion.p>

      <motion.p
        variants={fadeUp}
        className="hidden max-w-lg font-sans text-sm font-semibold leading-snug text-ink/80 sm:block lg:max-w-xl lg:text-base xl:text-lg"
      >
        {brand.hero.pitch}
      </motion.p>

      <motion.div
        variants={fadeUp}
        className="pointer-events-auto relative mt-1 hidden flex-col gap-2 sm:flex sm:flex-row sm:flex-wrap sm:items-center sm:gap-3"
      >
        <HeroCta />
      </motion.div>
    </motion.div>
  );
}
