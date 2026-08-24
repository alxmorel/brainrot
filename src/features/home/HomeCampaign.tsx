import Link from "next/link";
import { brand } from "@/data/brand";
import { HeroModels } from "@/features/home/HeroModels";
import { HomeBestsellers } from "@/features/home/HomeBestsellers";
import { HomeHowItWorks } from "@/features/home/HomeHowItWorks";
import { HomeManifesto } from "@/features/home/HomeManifesto";
import { PromisesBar } from "@/features/home/PromisesBar";
import { ScatteredBrainrots } from "@/features/home/ScatteredBrainrots";
import { ArrowDoodle, StickerLabel } from "@/features/home/HeroStickers";
import { SiteFooter } from "@/shared/components/layout/SiteFooter";
import { SiteNav } from "@/shared/components/layout/SiteNav";
import type { Brainrototo } from "@/models";

const strokeTitle = {
  WebkitTextStroke: "3.5px #0a0a0a",
  paintOrder: "stroke fill",
  textShadow: "5px 5px 0 #0a0a0a",
} as const;

export function HomeCampaign({
  bestsellers,
}: {
  bestsellers: Brainrototo[];
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteNav />

      <main>
        <section className="relative overflow-hidden bg-[#fffdf8] lg:min-h-[calc(100dvh-4.75rem)]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/assets/decorations/paint-splash-bg.png')",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 18% 30%, #ff2fb3 0%, transparent 28%), radial-gradient(circle at 78% 70%, #3155ff 0%, transparent 32%), radial-gradient(circle at 40% 85%, #7c3cff 0%, transparent 30%)",
            }}
          />

          <div className="relative z-30 mx-auto w-full max-w-[1500px]">
            <ScatteredBrainrots />

            <div
              className={[
                "relative z-30 flex flex-col",
                "max-w-[100%] gap-2 px-3 pt-4",
                "sm:max-w-md sm:gap-4 sm:px-6 sm:pb-[calc(28dvh+5rem)] sm:pt-8",
                "lg:min-h-[calc(100dvh-4.75rem)] lg:max-w-xl lg:justify-center lg:gap-5 lg:px-8 lg:pb-28 lg:pt-12",
                "xl:max-w-2xl",
              ].join(" ")}
            >
              <StickerLabel tone="yellow" className="w-fit rotate-[-4deg]">
                {brand.series}
              </StickerLabel>

              <h1 className="rotate-[-2deg] font-display font-bold uppercase leading-[0.8] tracking-[-0.05em] text-[clamp(1.7rem,8vw,5.6rem)]">
                <span className="block max-[380px]:whitespace-normal whitespace-nowrap text-white" style={strokeTitle}>
                  {brand.hero.lines[0]}
                </span>
                <span
                  className="mt-0.5 block max-[380px]:whitespace-normal whitespace-nowrap text-hot-pink sm:mt-1"
                  style={strokeTitle}
                >
                  {brand.hero.lines[1]}
                </span>
                <span
                  className="mt-0.5 block max-[380px]:whitespace-normal whitespace-nowrap text-white sm:mt-1"
                  style={strokeTitle}
                >
                  {brand.hero.lines[2]}
                </span>
              </h1>

              <p className="font-display text-sm font-bold uppercase leading-tight tracking-[-0.03em] text-ink sm:text-base lg:text-lg">
                {brand.hero.kicker}{" "}
                <span className="text-ultraviolet">100% Brainrototo.</span>
              </p>

              <p className="hidden max-w-md font-sans text-sm font-bold leading-snug text-ink/80 sm:block lg:text-[0.95rem]">
                {brand.hero.pitch}
              </p>

              <div className="relative mt-1 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
                <ArrowDoodle className="absolute -left-1 -top-8 hidden rotate-[-18deg] sm:-left-7 sm:block" />
                <Link
                  href="/create"
                  className="inline-flex w-full items-center justify-center rounded-pill border-[3px] border-ink bg-hot-pink px-5 py-2.5 font-display text-sm font-bold uppercase tracking-tight text-white shadow-sticker transition-[transform,box-shadow] duration-[var(--duration-button)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-sticker-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hot-pink focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffdf8] sm:w-auto sm:px-8 sm:py-4 sm:text-base"
                >
                  {brand.hero.cta}
                </Link>
              </div>
            </div>

            <HeroModels />
          </div>
        </section>

        <PromisesBar />
        <HomeManifesto />
        <HomeBestsellers items={bestsellers} />
        <HomeHowItWorks />
      </main>

      <SiteFooter />
    </div>
  );
}
