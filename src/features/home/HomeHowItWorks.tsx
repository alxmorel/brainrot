"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { brand } from "@/data/brand";

const easeOut = [0.22, 1, 0.36, 1] as const;

const titleWords = brand.how.title.split(" ");

const stepEnter = [
  { x: -56, y: 0 },
  { x: 0, y: 40 },
  { x: 56, y: 0 },
] as const;

export function HomeHowItWorks() {
  const reduced = useReducedMotion();

  return (
    <section className="px-3 py-8 sm:px-6 sm:py-14 lg:px-10 lg:py-16 xl:px-12 xl:py-20">
      <div className="mx-auto max-w-[1760px]">
        <motion.p
          initial={reduced ? false : { opacity: 0, clipPath: "inset(0 100% 0 0)" }}
          whileInView={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: reduced ? 0.01 : 0.4, ease: easeOut }}
          className="text-[0.65rem] font-bold uppercase tracking-wide text-hot-pink sm:text-xs lg:text-sm"
        >
          {brand.how.eyebrow}
        </motion.p>

        <h2 className="mt-0.5 flex flex-wrap gap-x-[0.28em] font-display text-[clamp(1.45rem,4vw,3.75rem)] font-bold uppercase leading-none tracking-[-0.04em] text-ink">
          {titleWords.map((word, index) => (
            <motion.span
              key={`${word}-${index}`}
              initial={
                reduced
                  ? false
                  : { opacity: 0, y: 18, filter: "blur(8px)" }
              }
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{
                duration: reduced ? 0.01 : 0.38,
                delay: reduced ? 0 : 0.12 + index * 0.09,
                ease: easeOut,
              }}
              className="inline-block"
            >
              {word}
            </motion.span>
          ))}
        </h2>

        <ol className="mt-5 grid grid-cols-1 gap-2 sm:mt-8 sm:grid-cols-3 sm:gap-4 lg:mt-10 lg:gap-6">
          {brand.how.steps.map((step, index) => {
            const from = stepEnter[index] ?? stepEnter[0];
            return (
              <motion.li
                key={step.n}
                initial={
                  reduced
                    ? false
                    : { opacity: 0, x: from.x, y: from.y, scale: 0.96 }
                }
                whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: reduced ? 0.01 : 0.42,
                  delay: reduced ? 0 : 0.35 + index * 0.14,
                  ease: easeOut,
                }}
                className="flex items-center gap-3 rounded-xl border-[3px] border-ink bg-white p-2.5 shadow-sticker-sm sm:block sm:rounded-2xl sm:p-5 lg:p-7 xl:p-8"
              >
                <motion.p
                  initial={reduced ? false : { scale: 0.4, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    type: reduced ? undefined : "spring",
                    stiffness: 420,
                    damping: 18,
                    delay: reduced ? 0 : 0.48 + index * 0.14,
                  }}
                  className="font-display text-sm font-bold uppercase tracking-tight text-hot-pink lg:text-lg"
                >
                  {step.n}
                </motion.p>
                <div>
                  <h3 className="font-display text-sm font-bold uppercase leading-none text-ink sm:mt-2 sm:text-xl lg:mt-3 lg:text-2xl xl:text-3xl">
                    {step.title}
                  </h3>
                  <p className="mt-2 hidden text-sm font-bold leading-snug text-ink/70 sm:block lg:mt-3 lg:text-base xl:text-lg">
                    {step.text}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </ol>

        <motion.div
          initial={reduced ? false : { opacity: 0, scaleX: 0.7 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{
            delay: reduced ? 0 : 0.85,
            duration: reduced ? 0.01 : 0.35,
            ease: easeOut,
          }}
          className="mt-5 origin-left sm:mt-8 lg:mt-10"
        >
          <Link
            href="/create"
            className="inline-flex w-full items-center justify-center rounded-pill border-[3px] border-ink bg-hot-pink px-6 py-3 font-display text-sm font-bold uppercase tracking-tight text-white shadow-sticker sm:w-auto lg:px-10 lg:py-4 lg:text-lg"
          >
            {brand.how.cta}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
