import Image from "next/image";
import { brand } from "@/data/brand";
import { Doodle } from "@/shared/components/brand/Doodle";
import type { Brainrototo } from "@/models";

export function PackRevealOverlay({ brainrot }: { brainrot: Brainrototo }) {
  return (
    <div
      className="pack-open-stage pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
      aria-hidden
    >
      <div className="pack-open-flash absolute inset-[18%] rounded-[2rem] bg-[radial-gradient(circle,rgb(255_255_255/0.45)_0%,rgb(223_255_0/0.22)_42%,transparent_70%)]" />
      <div className="pack-open-slash absolute left-1/2 top-1/2 h-10 w-[140%] -translate-x-1/2 -translate-y-1/2 bg-[linear-gradient(90deg,transparent,var(--br-yellow)_18%,#fff_50%,var(--br-pink)_82%,transparent)] opacity-90" />

      <Doodle
        kind="star"
        className="pack-open-burst left-[8%] top-[14%] h-10 w-10 text-blue sm:h-12 sm:w-12"
      />
      <Doodle
        kind="burst"
        className="pack-open-burst right-[10%] top-[18%] h-9 w-9 sm:h-11 sm:w-11 [animation-delay:430ms]"
      />
      <Doodle
        kind="bolt"
        className="pack-open-burst bottom-[16%] left-[12%] h-9 w-9 text-acid-yellow sm:h-11 sm:w-11 [animation-delay:460ms]"
      />
      <Doodle
        kind="star"
        className="pack-open-burst bottom-[18%] right-[8%] h-8 w-8 fill-hot-pink sm:h-10 sm:w-10 [animation-delay:480ms]"
      />

      <div
        className="pack-open-card relative aspect-[5/7] h-[min(72%,22rem)] w-auto"
        style={{ perspective: "1100px" }}
      >
        <div className="pack-open-inner relative h-full w-full">
          <div className="pack-open-face pack-open-shine absolute inset-0 overflow-hidden rounded-2xl border-[3px] border-ink bg-holo shadow-sticker">
            <div className="flex h-full flex-col items-center justify-center gap-3 px-4">
              <p className="font-display text-[0.65rem] font-bold uppercase tracking-tight text-ink/70">
                {brand.series}
              </p>
              <p className="text-center font-display text-xl font-bold uppercase leading-none text-white text-sticker sm:text-2xl">
                {brand.name}
              </p>
              <span className="mt-1 rounded-pill border-[3px] border-ink bg-acid-yellow px-3 py-1 font-display text-[0.65rem] font-bold uppercase shadow-sticker-sm">
                Pack
              </span>
            </div>
          </div>
          <div className="pack-open-face pack-open-face-front absolute inset-0 overflow-hidden rounded-2xl border-[3px] border-ink bg-white shadow-sticker">
            <div className="flex h-full flex-col bg-[linear-gradient(180deg,rgb(255_255_255/0.4),transparent_36%)]">
              <div className="relative flex min-h-0 flex-1 items-center justify-center bg-candy p-3">
                <Image
                  src={brainrot.image}
                  alt=""
                  width={320}
                  height={320}
                  className="max-h-full w-auto object-contain drop-shadow-[4px_4px_0_#0a0a0a]"
                />
              </div>
              <p className="border-t-[3px] border-ink px-2 py-2 text-center font-display text-sm font-bold uppercase leading-none text-ink sm:text-base">
                {brainrot.name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
