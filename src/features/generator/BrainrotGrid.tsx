"use client";

import Image from "next/image";
import type { Brainrototo } from "@/models";
import { cn } from "@/shared/utils/cn";

const papers = [
  "bg-acid-yellow",
  "bg-hot-pink",
  "bg-electric-cyan",
  "bg-acid-green",
  "bg-ultraviolet",
  "bg-fluoro-orange",
  "bg-blue",
] as const;

function look(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) {
    h = (h * 31 + id.charCodeAt(i)) >>> 0;
  }
  return {
    paper: papers[h % papers.length],
    restRotate: (h % 7) - 3,
  };
}

export function BrainrotGrid({
  items,
  selectedId,
  onSelect,
}: {
  items: Brainrototo[];
  selectedId: string | null;
  onSelect: (brainrot: Brainrototo) => void;
}) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
      {items.map((brainrot) => {
        const selected = brainrot.id === selectedId;
        const vis = look(brainrot.id);

        return (
          <li key={brainrot.id}>
            <button
              type="button"
              onClick={() => onSelect(brainrot)}
              aria-pressed={selected}
              style={{
                transform: selected
                  ? "rotate(-2.5deg)"
                  : `rotate(${vis.restRotate}deg)`,
              }}
              className={cn(
                "relative flex h-full w-full overflow-hidden rounded-[1.35rem] border-[3px] border-ink text-left shadow-sticker-sm transition-[transform,box-shadow,opacity] duration-[var(--duration-card)] hover:-translate-y-1",
                vis.paper,
                selected
                  ? "shadow-sticker"
                  : "opacity-80 hover:opacity-100",
              )}
            >
              <span className="relative block aspect-square w-full">
                <Image
                  src={brainrot.image}
                  alt={brainrot.name}
                  fill
                  sizes="(max-width: 640px) 45vw, 20vw"
                  className="object-contain p-2"
                />
                <span
                  className={cn(
                    "absolute bottom-2 left-2 right-2 z-10 inline-block w-fit max-w-[90%] rotate-[-2deg] border-[3px] border-ink bg-white px-2 py-1 font-display font-bold uppercase leading-[1.05] tracking-[-0.03em] text-ink shadow-sticker-sm",
                    selected
                      ? "text-sm sm:text-lg"
                      : "text-[0.65rem] sm:text-xs",
                  )}
                >
                  {brainrot.name}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
