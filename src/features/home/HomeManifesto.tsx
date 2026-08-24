import Link from "next/link";
import { brand } from "@/data/brand";
import { cn } from "@/shared/utils/cn";

const toneClass = {
  green: "bg-acid-green text-ink",
  yellow: "bg-acid-yellow text-ink",
  violet: "bg-ultraviolet text-white",
} as const;

const tilts = ["-rotate-3", "rotate-2", "-rotate-1"] as const;

export function HomeManifesto() {
  const { manifesto } = brand;

  return (
    <section className="px-3 py-8 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-[1100px]">
        <p className="text-[0.65rem] font-bold uppercase tracking-wide text-hot-pink sm:text-xs">
          {manifesto.eyebrow}
        </p>
        <h2 className="mt-0.5 font-display text-[clamp(1.45rem,4vw,3rem)] font-bold uppercase leading-none tracking-[-0.04em] text-ink">
          {manifesto.title}
        </h2>
        <p className="mt-3 max-w-xl font-sans text-sm font-bold leading-snug text-ink/75 sm:text-base">
          {manifesto.body}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-3 sm:mt-8 sm:gap-x-3">
          {manifesto.traits.map((trait, index) => (
            <div key={trait.id} className="contents">
              {index > 0 ? (
                <p
                  aria-hidden
                  className="font-display text-base font-bold text-ink sm:text-xl"
                >
                  ×
                </p>
              ) : null}
              <article
                className={cn(
                  "inline-flex flex-col rounded-md border-[3px] border-ink px-2.5 py-1.5 shadow-sticker-sm sm:px-3 sm:py-2",
                  toneClass[trait.tone],
                  tilts[index],
                )}
              >
                <p className="font-display text-sm font-bold uppercase leading-none tracking-tight sm:text-base">
                  {trait.label}
                </p>
                <p className="mt-1 text-[0.65rem] font-bold leading-none opacity-75 sm:text-xs">
                  {trait.hint}
                </p>
              </article>
            </div>
          ))}
          <p aria-hidden className="font-display text-base font-bold text-ink sm:text-xl">
            =
          </p>
          <p className="inline-flex rounded-md border-[3px] border-ink bg-white px-2.5 py-1.5 font-display text-sm font-bold uppercase leading-none tracking-tight shadow-sticker-sm sm:px-3 sm:py-2 sm:text-base">
            {manifesto.result}
          </p>
        </div>

        <Link
          href="/create"
          className="mt-6 inline-flex w-full items-center justify-center rounded-pill border-[3px] border-ink bg-hot-pink px-6 py-3 font-display text-sm font-bold uppercase tracking-tight text-white shadow-sticker sm:mt-8 sm:w-auto"
        >
          {brand.hero.cta}
        </Link>
      </div>
    </section>
  );
}
