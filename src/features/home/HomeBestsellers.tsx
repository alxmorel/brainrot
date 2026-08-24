"use client";

import { useRef } from "react";
import Link from "next/link";
import { brand } from "@/data/brand";
import { GangTeeCard } from "@/features/home/GangTeeCard";
import type { Brainrototo } from "@/models";

export function HomeBestsellers({ items }: { items: Brainrototo[] }) {
  const scroller = useRef<HTMLUListElement>(null);

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
    <section className="px-3 py-8 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        <header className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-wide text-hot-pink sm:text-xs">
              {brand.gang.eyebrow}
            </p>
            <h2 className="mt-0.5 font-display text-[clamp(1.45rem,4vw,3rem)] font-bold uppercase leading-none tracking-[-0.04em] text-ink">
              {brand.gang.title}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Précédent"
              onClick={() => scrollByCard(-1)}
              className="hidden h-10 w-10 items-center justify-center rounded-pill border-[3px] border-ink bg-white font-display text-lg font-bold shadow-sticker-sm sm:inline-flex hover:bg-acid-yellow"
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Suivant"
              onClick={() => scrollByCard(1)}
              className="hidden h-10 w-10 items-center justify-center rounded-pill border-[3px] border-ink bg-white font-display text-lg font-bold shadow-sticker-sm sm:inline-flex hover:bg-acid-yellow"
            >
              →
            </button>
            <Link
              href="/create"
              className="shrink-0 font-display text-sm font-bold uppercase text-hot-pink underline decoration-2 underline-offset-2 sm:text-base"
            >
              {brand.gang.seeAll}
            </Link>
          </div>
        </header>

        <ul
          ref={scroller}
          className="-mx-3 mt-5 flex items-stretch snap-x snap-mandatory gap-3 overflow-x-auto px-3 pb-4 sm:mx-0 sm:mt-8 sm:gap-4 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((brainrot) => (
            <li
              key={brainrot.id}
              className="w-[min(88%,18rem)] shrink-0 snap-start sm:w-[20rem]"
            >
              <GangTeeCard brainrot={brainrot} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
