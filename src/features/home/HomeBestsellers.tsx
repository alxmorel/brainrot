"use client";

import { useRef, type ReactNode } from "react";
import { ComposeLink } from "@/shared/components/layout/ComposeLink";
import { motion, useReducedMotion } from "motion/react";
import { brand } from "@/data/brand";
import { customProductNote, shippingNote } from "@/data/pricing";
import { defaultProduct } from "@/data/products";
import { GangTeeCard } from "@/features/home/GangTeeCard";
import { PriceTag } from "@/shared/components/ui";
import type { Brainrototo } from "@/models";
import { cn } from "@/shared/utils/cn";

const easeOut = [0.22, 1, 0.36, 1] as const;
const spring = [0.34, 1.45, 0.64, 1] as const;

/** Only the first cards get a staged entrance - the rest stay cheap to paint. */
const ANIMATED_CARDS = 4;

export function HomeBestsellers({
  items,
  compact = false,
  extra,
}: {
  items: Brainrototo[];
  compact?: boolean;
  extra?: ReactNode;
}) {
  const scroller = useRef<HTMLUListElement>(null);
  const reduced = useReducedMotion();

  function scrollByCard(direction: -1 | 1) {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector("li");
    const gap = 16;
    const width = card ? card.getBoundingClientRect().width + gap : 320;
    el.scrollBy({ left: direction * width, behavior: "smooth" });
  }

  if (items.length === 0) return null;

  return (
    <section
      id="bande"
      className={cn(
        "scroll-mt-28 py-8 sm:py-14 lg:py-16 xl:py-20",
        compact
          ? "px-4 sm:px-6 lg:px-8"
          : "px-3 sm:px-6 lg:px-10 xl:px-12",
      )}
    >
      <div className="mx-auto max-w-[1760px]">
        <motion.header
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: reduced ? 0 : 0.08,
                delayChildren: reduced ? 0 : 0.02,
              },
            },
          }}
          className={cn(
            "flex gap-3",
            compact
              ? "flex-col sm:flex-row sm:items-end sm:justify-between"
              : "items-end justify-between",
          )}
        >
          <div>
            <motion.p
              variants={{
                hidden: { opacity: 0, y: reduced ? 0 : 12 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: reduced ? 0.01 : 0.3, ease: easeOut },
                },
              }}
              className="text-[0.65rem] font-bold uppercase tracking-wide text-hot-pink sm:text-xs lg:text-sm"
            >
              {brand.gang.eyebrow}
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
                  transition: {
                    duration: reduced ? 0.01 : 0.4,
                    ease: spring,
                  },
                },
              }}
              className={cn(
                "mt-0.5 origin-left font-display font-bold uppercase leading-none tracking-[-0.04em] text-ink",
                compact
                  ? "text-[clamp(1.25rem,3vw,2rem)]"
                  : "text-[clamp(1.45rem,4vw,3.75rem)]",
              )}
            >
              {brand.gang.title}
            </motion.h2>
            {compact ? null : (
              <motion.p
                variants={{
                  hidden: { opacity: 0, y: reduced ? 0 : 12 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: reduced ? 0.01 : 0.3, ease: easeOut },
                  },
                }}
                className="mt-2 font-display text-sm font-bold uppercase tracking-tight text-ink/70 sm:text-base lg:text-lg"
              >
                {defaultProduct.name} · <PriceTag />
              </motion.p>
            )}
          </div>
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  delay: reduced ? 0 : 0.12,
                  duration: reduced ? 0.01 : 0.3,
                  ease: easeOut,
                },
              },
            }}
            className={cn(
              "flex flex-wrap items-center gap-2 lg:gap-3",
              compact ? "justify-start sm:justify-end" : "justify-end",
            )}
          >
            <button
              type="button"
              aria-label="Précédent"
              onClick={() => scrollByCard(-1)}
              className="hidden h-10 w-10 items-center justify-center rounded-pill border-[3px] border-ink bg-white font-display text-lg font-bold shadow-sticker-sm sm:inline-flex hover:bg-acid-yellow lg:h-12 lg:w-12 lg:text-xl"
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Suivant"
              onClick={() => scrollByCard(1)}
              className="hidden h-10 w-10 items-center justify-center rounded-pill border-[3px] border-ink bg-white font-display text-lg font-bold shadow-sticker-sm sm:inline-flex hover:bg-acid-yellow lg:h-12 lg:w-12 lg:text-xl"
            >
              →
            </button>
            {compact && extra ? (
              <nav
                className="flex flex-wrap items-center justify-end gap-2"
                aria-label="Découvrir"
              >
                {extra}
              </nav>
            ) : null}
            {compact ? null : (
              <ComposeLink
                className="shrink-0 font-display text-sm font-bold uppercase text-hot-pink underline decoration-2 underline-offset-2 sm:text-base lg:text-lg"
              >
                {brand.gang.seeAll}
              </ComposeLink>
            )}
          </motion.div>
        </motion.header>

        <ul
          ref={scroller}
          className={cn(
            "mt-5 flex items-stretch snap-x snap-mandatory gap-3 overflow-x-auto pb-4 sm:mt-8 sm:gap-4 lg:mt-10 lg:gap-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            compact
              ? ""
              : "-mx-3 px-3 sm:mx-0 sm:px-0",
          )}
        >
          {items.map((brainrot, index) => {
            const staged = index < ANIMATED_CARDS;

            return (
              <li
                key={brainrot.id}
                className={
                  compact
                    ? "w-[min(80%,15rem)] shrink-0 snap-start sm:w-[16rem] lg:w-[17rem]"
                    : "w-[min(88%,18rem)] shrink-0 snap-start sm:w-[20rem] lg:w-[22rem] xl:w-[24rem]"
                }
              >
                <motion.div
                  initial={
                    reduced
                      ? false
                      : staged
                        ? { opacity: 0, y: 36 }
                        : { opacity: 0 }
                  }
                  whileInView={
                    staged
                      ? { opacity: 1, y: 0 }
                      : { opacity: 1 }
                  }
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: reduced ? 0.01 : staged ? 0.38 : 0.25,
                    delay: reduced ? 0 : staged ? 0.12 + index * 0.08 : 0.2,
                    ease: easeOut,
                  }}
                  className="h-full"
                >
                  <GangTeeCard brainrot={brainrot} compact={compact} />
                </motion.div>
              </li>
            );
          })}
        </ul>

        <motion.p
          initial={reduced ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            delay: reduced ? 0 : 0.4,
            duration: reduced ? 0.01 : 0.3,
            ease: easeOut,
          }}
          className="mt-3 text-sm font-bold leading-snug text-ink/45 sm:mt-4 lg:text-base"
        >
          {shippingNote}. {customProductNote}
        </motion.p>
      </div>
    </section>
  );
}
