"use client";

import { motion, useReducedMotion } from "motion/react";
import { brand } from "@/data/brand";
import { cn } from "@/shared/utils/cn";

const toneClass = {
  green: "bg-acid-green text-ink",
  yellow: "bg-acid-yellow text-ink",
  violet: "bg-ultraviolet text-white",
} as const;

const tilts = [-3, 2, -1] as const;
const easeOut = [0.22, 1, 0.36, 1] as const;
const spring = [0.34, 1.4, 0.64, 1] as const;

export function HomeManifesto() {
  const { manifesto } = brand;
  const reduced = useReducedMotion();

  const fadeUp = {
    hidden: { opacity: 0, y: reduced ? 0 : 28 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0.01 : 0.4, ease: easeOut },
    },
  };

  return (
    <section className="px-3 py-8 sm:px-6 sm:py-14 lg:px-10 lg:py-16 xl:px-12 xl:py-20">
      <div className="mx-auto max-w-[1760px]">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
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
            {manifesto.eyebrow}
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mt-0.5 font-display text-[clamp(1.45rem,4vw,3.75rem)] font-bold uppercase leading-none tracking-[-0.04em] text-ink"
          >
            {manifesto.title}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-3 max-w-xl font-sans text-sm font-bold leading-snug text-ink/75 sm:text-base lg:mt-4 lg:max-w-2xl lg:text-lg xl:text-xl"
          >
            {manifesto.body}
          </motion.p>

          <motion.div
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: reduced ? 0 : 0.07,
                  delayChildren: reduced ? 0 : 0.06,
                },
              },
            }}
            className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-3 sm:mt-8 sm:gap-x-3 lg:mt-10 lg:gap-x-4 lg:gap-y-4"
          >
            {manifesto.traits.flatMap((trait, index) => {
              const chip = (
                <motion.article
                  key={trait.id}
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: reduced ? 0 : 20,
                      rotate: reduced ? tilts[index] : tilts[index] - 8,
                      scale: reduced ? 1 : 0.85,
                    },
                    show: {
                      opacity: 1,
                      y: 0,
                      rotate: tilts[index],
                      scale: 1,
                      transition: {
                        duration: reduced ? 0.01 : 0.4,
                        ease: spring,
                      },
                    },
                  }}
                  className={cn(
                    "inline-flex flex-col rounded-md border-[3px] border-ink px-2.5 py-1.5 shadow-sticker-sm sm:px-3 sm:py-2 lg:rounded-lg lg:px-5 lg:py-3.5",
                    toneClass[trait.tone],
                  )}
                >
                  <p className="font-display text-sm font-bold uppercase leading-none tracking-tight sm:text-base lg:text-2xl">
                    {trait.label}
                  </p>
                  <p className="mt-1 text-[0.65rem] font-bold leading-none opacity-75 sm:text-xs lg:mt-2 lg:text-sm">
                    {trait.hint}
                  </p>
                </motion.article>
              );

              if (index === 0) return [chip];

              return [
                <motion.p
                  key={`x-${trait.id}`}
                  aria-hidden
                  variants={{
                    hidden: { opacity: 0, scale: reduced ? 1 : 0.6 },
                    show: {
                      opacity: 1,
                      scale: 1,
                      transition: {
                        duration: reduced ? 0.01 : 0.3,
                        ease: spring,
                      },
                    },
                  }}
                  className="font-display text-base font-bold text-ink sm:text-xl lg:text-3xl"
                >
                  ×
                </motion.p>,
                chip,
              ];
            })}
            <motion.p
              aria-hidden
              variants={{
                hidden: { opacity: 0, scale: reduced ? 1 : 0.6 },
                show: {
                  opacity: 1,
                  scale: 1,
                  transition: { duration: reduced ? 0.01 : 0.3, ease: spring },
                },
              }}
              className="font-display text-base font-bold text-ink sm:text-xl lg:text-3xl"
            >
              =
            </motion.p>
            <motion.p
              variants={{
                hidden: {
                  opacity: 0,
                  y: reduced ? 0 : 20,
                  scale: reduced ? 1 : 0.85,
                },
                show: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: reduced ? 0.01 : 0.4, ease: spring },
                },
              }}
              className="inline-flex rounded-md border-[3px] border-ink bg-white px-2.5 py-1.5 font-display text-sm font-bold uppercase leading-none tracking-tight shadow-sticker-sm sm:px-3 sm:py-2 sm:text-base lg:rounded-lg lg:px-5 lg:py-3.5 lg:text-2xl"
            >
              {manifesto.result}
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
