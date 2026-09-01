"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/shared/utils/cn";
import { legal } from "@/data/legal";
import { PriceTag } from "@/shared/components/ui";

const promises = [
  {
    title: "Prix d’ouverture",
    subtitle: "Livraison comprise",
    icon: "tag" as const,
  },
  {
    title: "Tee bio",
    subtitle: "Coton SOL’S, print DTG",
    icon: "shield" as const,
  },
  {
    title: legal.deliveryShort,
    subtitle: "Print local, France & UE",
    icon: "bolt" as const,
  },
];

const easeOut = [0.22, 1, 0.36, 1] as const;

function PromiseIcon({ icon }: { icon: (typeof promises)[number]["icon"] }) {
  const size = "h-7 w-7 shrink-0 sm:h-10 sm:w-10 lg:h-12 lg:w-12 xl:h-14 xl:w-14";

  if (icon === "tag") {
    return (
      <svg viewBox="0 0 64 64" className={size} aria-hidden>
        <path
          d="M10 28 28 10h18l8 8v18L36 54 10 28z"
          fill="#FF2FB3"
          stroke="#0a0a0a"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <circle cx="40" cy="22" r="4" fill="#fff" stroke="#0a0a0a" strokeWidth="2.5" />
      </svg>
    );
  }

  if (icon === "bolt") {
    return (
      <svg viewBox="0 0 64 64" className={size} aria-hidden>
        <path
          d="M34 6 16 36h14l-4 22 24-34H34l6-18z"
          fill="#7CFF00"
          stroke="#0a0a0a"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" className={size} aria-hidden>
      <path
        d="M32 6 52 14v18c0 14-8 24-20 30C20 56 12 46 12 32V14l20-8z"
        fill="#3155FF"
        stroke="#0a0a0a"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="m24 32 6 6 12-14"
        fill="none"
        stroke="#fff"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Full-bleed divider between hero and the rest - not a floating overlap card. */
export function PromisesBar({ className }: { className?: string }) {
  const reduced = useReducedMotion();

  return (
    <motion.section
      aria-label="Engagements"
      initial={reduced ? false : { opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduced ? 0.01 : 0.4,
        delay: reduced ? 0 : 0.35,
        ease: easeOut,
      }}
      className={cn("border-y-[3px] border-ink bg-white", className)}
    >
      <motion.ul
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: reduced ? 0 : 0.08,
              delayChildren: reduced ? 0 : 0.42,
            },
          },
        }}
        className="mx-auto grid max-w-[1760px] grid-cols-3"
      >
        {promises.map((promise, index) => (
          <motion.li
            key={promise.title}
            variants={{
              hidden: { opacity: 0, y: reduced ? 0 : 24 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: reduced ? 0.01 : 0.36, ease: easeOut },
              },
            }}
            className={cn(
              "flex min-w-0 flex-col items-center gap-1 px-1.5 py-2.5 text-center sm:flex-row sm:gap-3 sm:px-5 sm:py-3.5 sm:text-left lg:gap-4 lg:px-8 lg:py-5 xl:px-12 xl:py-6",
              index > 0 && "border-l border-ink/15",
            )}
          >
            <PromiseIcon icon={promise.icon} />
            <div className="min-w-0">
              <p className="font-display text-[0.62rem] font-bold uppercase leading-[1.05] tracking-[-0.03em] text-ink sm:text-[1.05rem] lg:text-xl xl:text-2xl">
                {promise.icon === "tag" ? <PriceTag /> : promise.title}
              </p>
              <p className="mt-0.5 hidden text-sm font-medium leading-snug text-ink/55 sm:block lg:mt-1 lg:text-base xl:text-lg">
                {promise.subtitle}
              </p>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </motion.section>
  );
}
