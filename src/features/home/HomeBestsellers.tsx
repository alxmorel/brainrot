"use client";

import { useRef } from "react";
import Link from "next/link";
import { legal } from "@/data/legal";
import { defaultProduct } from "@/data/products";
import { TeeMockup } from "@/features/generator/TeeMockup";
import { cn } from "@/shared/utils/cn";
import type { CardPack } from "@/shared/components/ui";
import type { Brainrototo } from "@/models";

const packs: CardPack[] = ["sunset", "ocean", "acid", "candy"];

const packClass: Record<CardPack, string> = {
  sunset: "bg-sunset",
  ocean: "bg-ocean",
  acid: "bg-acid",
  candy: "bg-candy",
};

export function HomeBestsellers({ items }: { items: Brainrototo[] }) {
  const scroller = useRef<HTMLUListElement>(null);

  function scrollByCard(direction: -1 | 1) {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector("li");
    const gap = 16;
    const width = card ? card.getBoundingClientRect().width + gap : 280;
    el.scrollBy({ left: direction * width, behavior: "smooth" });
  }

  if (items.length === 0) return null;

  return (
    <section className="px-3 py-8 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        <header className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-wide text-hot-pink sm:text-xs">
              Les plus vendus
            </p>
            <h2 className="mt-0.5 font-display text-[clamp(1.45rem,4vw,3rem)] font-bold uppercase leading-none tracking-[-0.04em] text-ink">
              La collection
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
              Voir tout
            </Link>
          </div>
        </header>

        <ul
          ref={scroller}
          className="-mx-3 mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-3 pb-2 sm:mx-0 sm:mt-8 sm:gap-4 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((brainrot, index) => (
            <li
              key={brainrot.id}
              className="w-[72%] shrink-0 snap-start sm:w-[15.5rem] lg:w-[17.5rem]"
            >
              <Link
                href={`/tee/${brainrot.id}`}
                className="group flex h-full flex-col overflow-hidden rounded-xl border-[3px] border-ink bg-white shadow-sticker-sm transition-[transform,box-shadow] duration-[var(--duration-card)] hover:-translate-y-1 hover:shadow-sticker"
              >
                <div
                  className={cn(
                    "relative flex aspect-square items-center justify-center p-3 sm:aspect-[4/5] sm:p-4",
                    packClass[packs[index % packs.length]],
                  )}
                >
                  <TeeMockup
                    product={defaultProduct}
                    brainrot={brainrot}
                    className="max-w-[9.5rem] sm:max-w-[14rem]"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-1 border-t-[3px] border-ink p-3 sm:p-4">
                  <p className="font-display text-[0.85rem] font-bold uppercase leading-[1.05] tracking-[-0.03em] text-ink sm:text-lg">
                    {brainrot.name}
                  </p>
                  <p className="text-xs font-bold text-ink/70 sm:text-sm">
                    {legal.priceTtc}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
