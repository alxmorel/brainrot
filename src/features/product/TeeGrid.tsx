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

export function TeeGrid({ items }: { items: Brainrototo[] }) {
  return (
    <ul className="grid grid-cols-2 gap-2.5 sm:gap-5 lg:grid-cols-3">
      {items.map((brainrot, index) => (
        <li key={brainrot.id}>
          <Link
            href={`/tee/${brainrot.id}`}
            className="group flex h-full flex-col overflow-hidden rounded-xl border-[3px] border-ink bg-white shadow-sticker-sm transition-[transform,box-shadow] duration-[var(--duration-card)] hover:-translate-y-1 hover:shadow-sticker"
          >
            <div
              className={cn(
                "relative flex aspect-square items-center justify-center p-2 sm:aspect-[4/5] sm:p-4",
                packClass[packs[index % packs.length]],
              )}
            >
              <TeeMockup
                product={defaultProduct}
                brainrot={brainrot}
                className="max-w-[9.5rem] sm:max-w-[16rem]"
              />
            </div>
            <div className="flex flex-1 flex-col gap-1 border-t-[3px] border-ink p-2 sm:gap-2 sm:p-4">
              <p className="font-display text-[0.8rem] font-bold uppercase leading-[1.05] tracking-[-0.03em] text-ink sm:text-xl">
                {brainrot.name}
              </p>
              <p className="text-xs font-bold text-ink/70 sm:text-sm">
                {legal.priceTtc}
              </p>
              <span className="mt-auto hidden font-display text-sm font-bold uppercase tracking-tight text-hot-pink sm:inline">
                Voir le tee →
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
