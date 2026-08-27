"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { brand } from "@/data/brand";
import { StickerLabel } from "@/features/home/HeroStickers";

const strokeTitle = {
  WebkitTextStroke: "4px #0a0a0a",
  paintOrder: "stroke fill",
  textShadow: "5px 5px 0 #0a0a0a",
} as const;

const easeOut = [0.22, 1, 0.36, 1] as const;

/** Viewport minus nav (~4.75rem) minus promises bar so it stays in first paint. */
export const heroH =
  "lg:min-h-[calc(100dvh-4.75rem-6.25rem)] xl:min-h-[calc(100dvh-4.75rem-7.25rem)]";

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
        "pointer-events-none relative z-30 flex flex-col",
        "max-w-[100%] gap-2 px-3 pt-4",
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
        className="font-display font-bold uppercase leading-[0.8] tracking-[-0.05em] text-[clamp(1.7rem,8vw,5.6rem)] xl:text-[clamp(4.25rem,5.8vw,6.75rem)]"
      >
        <motion.span
          variants={line}
          className="block max-[380px]:whitespace-normal whitespace-nowrap text-white"
          style={strokeTitle}
        >
          {brand.hero.lines[0]}
        </motion.span>
        <motion.span
          variants={line}
          className="mt-0.5 block max-[380px]:whitespace-normal whitespace-nowrap text-hot-pink sm:mt-1"
          style={strokeTitle}
        >
          {brand.hero.lines[1]}
        </motion.span>
        <motion.span
          variants={line}
          className="mt-0.5 block max-[380px]:whitespace-normal whitespace-nowrap text-white sm:mt-1"
          style={strokeTitle}
        >
          {brand.hero.lines[2]}
        </motion.span>
      </motion.h1>

      <motion.p
        variants={fadeUp}
        className="font-display text-sm font-bold uppercase leading-tight tracking-[-0.03em] text-ink sm:text-base lg:text-xl xl:text-2xl"
      >
        {brand.hero.kicker}{" "}
        <span className="text-ultraviolet">100% Brainrototo.</span>
      </motion.p>

      <motion.p
        variants={fadeUp}
        className="hidden max-w-lg font-sans text-sm font-bold leading-snug text-ink/80 sm:block lg:max-w-xl lg:text-base xl:text-lg"
      >
        {brand.hero.pitch}
      </motion.p>

      <motion.div
        variants={fadeUp}
        className="pointer-events-auto relative mt-1 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3"
      >
        <Link
          href="/create"
          className="inline-flex w-full items-center justify-center rounded-pill border-[3px] border-ink bg-hot-pink px-5 py-2.5 font-display text-sm font-bold uppercase tracking-tight text-white shadow-sticker transition-[transform,box-shadow] duration-[var(--duration-button)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-sticker-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hot-pink focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffdf8] sm:w-auto sm:px-8 sm:py-4 sm:text-base lg:px-10 lg:py-5 lg:text-lg xl:text-xl"
        >
          {brand.hero.cta}
        </Link>
      </motion.div>
    </motion.div>
  );
}
