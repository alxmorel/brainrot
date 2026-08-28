"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { getHomeArchiveCharacters } from "@/data/archive";
import { brand } from "@/data/brand";
import { ArchivePortrait } from "@/features/archive/ArchivePortrait";

const easeOut = [0.22, 1, 0.36, 1] as const;
const spring = [0.34, 1.4, 0.64, 1] as const;
const tilts = [-6, 4, -3, 5, -5, 2] as const;

export function HomeArchiveWall() {
  const reduced = useReducedMotion();
  const characters = getHomeArchiveCharacters();

  if (characters.length === 0) return null;

  const fadeUp = {
    hidden: { opacity: 0, y: reduced ? 0 : 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0.01 : 0.38, ease: easeOut },
    },
  };

  return (
    <section className="px-3 py-8 sm:px-6 sm:py-14 lg:px-10 lg:py-16 xl:px-12 xl:py-20">
      <div className="mx-auto max-w-[1760px]">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: reduced ? 0 : 0.08,
                delayChildren: reduced ? 0 : 0.04,
              },
            },
          }}
        >
          <motion.p
            variants={fadeUp}
            className="text-[0.65rem] font-bold uppercase tracking-wide text-hot-pink sm:text-xs lg:text-sm"
          >
            {brand.archive.homeEyebrow}
          </motion.p>
          <motion.h2
            variants={{
              hidden: {
                opacity: 0,
                y: reduced ? 0 : 28,
                scale: reduced ? 1 : 0.92,
              },
              show: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { duration: reduced ? 0.01 : 0.4, ease: spring },
              },
            }}
            className="mt-0.5 origin-left font-display text-[clamp(1.45rem,4vw,3.75rem)] font-bold uppercase leading-none tracking-[-0.04em] text-ink"
          >
            {brand.archive.homeTitle}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-3 max-w-xl font-sans text-sm font-bold leading-snug text-ink/75 sm:text-base lg:mt-4 lg:max-w-2xl lg:text-lg xl:text-xl"
          >
            {brand.archive.homeLead}
          </motion.p>
        </motion.div>

        <ul className="mt-6 flex flex-wrap items-end justify-center gap-x-3 gap-y-5 sm:mt-8 sm:gap-x-5 sm:gap-y-6 lg:mt-10 lg:gap-x-7">
          {characters.map((character, index) => {
            const tilt = tilts[index] ?? 0;
            return (
              <li
                key={character.slug}
                className="w-[30%] min-w-[6.5rem] max-w-[11.5rem] sm:w-[9.5rem] lg:w-[11.5rem]"
              >
                <motion.div
                  initial={
                    reduced
                      ? false
                      : { opacity: 0, y: 28, rotate: tilt - 8, scale: 0.9 }
                  }
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    rotate: tilt,
                    scale: 1,
                    transition: {
                      duration: reduced ? 0.01 : 0.28,
                      delay: reduced ? 0 : 0.08 + index * 0.06,
                      ease: spring,
                    },
                  }}
                  whileHover={
                    reduced
                      ? undefined
                      : {
                          y: -8,
                          rotate: tilt + (tilt >= 0 ? 3 : -3),
                          scale: 1.05,
                          transition: { duration: 0.18, ease: easeOut },
                        }
                  }
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <Link
                    href={`/brainrots/${character.slug}`}
                    className="flex flex-col items-center"
                  >
                    <ArchivePortrait
                      src={character.image}
                      alt={character.name}
                      tone={character.stickerTone}
                      sizes="(max-width: 640px) 30vw, 184px"
                      className="aspect-square w-full rounded-xl sm:rounded-2xl"
                    />
                    <span className="mt-2 text-center font-display text-[0.65rem] font-bold uppercase leading-tight tracking-tight text-ink sm:text-sm lg:text-base">
                      {character.name}
                    </span>
                  </Link>
                </motion.div>
              </li>
            );
          })}
        </ul>

        <motion.div
          initial={reduced ? false : { opacity: 0, scaleX: 0.7 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{
            delay: reduced ? 0 : 0.45,
            duration: reduced ? 0.01 : 0.35,
            ease: easeOut,
          }}
          className="mt-6 origin-left sm:mt-8 lg:mt-10"
        >
          <Link
            href="/brainrots"
            className="inline-flex w-full items-center justify-center rounded-pill border-[3px] border-ink bg-hot-pink px-6 py-3 font-display text-sm font-bold uppercase tracking-tight text-white shadow-sticker sm:w-auto lg:px-10 lg:py-4 lg:text-lg"
          >
            {brand.archive.homeCta}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
