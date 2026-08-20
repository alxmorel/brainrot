import Link from "next/link";
import { BrandWordmark } from "@/shared/components/brand";
import { HeroModels } from "@/features/home/HeroModels";
import { PromisesBar } from "@/features/home/PromisesBar";
import { ScatteredBrainrots } from "@/features/home/ScatteredBrainrots";
import {
  ArrowDoodle,
  MotionLines,
  ScribbleNote,
  StarBurst,
} from "@/features/home/HeroStickers";

export function HomeCampaign() {
  return (
    <main className="relative h-dvh w-full overflow-hidden bg-[#fffdf8]">
      {/* PLAN 0 — painted canvas */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/assets/decorations/paint-splash-bg.png')",
        }}
      />
      {/* soft density so yellow voids don't read as empty */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 30%, #ff2fb3 0%, transparent 28%), radial-gradient(circle at 78% 70%, #3155ff 0%, transparent 32%), radial-gradient(circle at 40% 85%, #7c3cff 0%, transparent 30%)",
        }}
      />

      {/* PLAN 3 — graphic accents filling empty paint zones */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[22]">
        <StarBurst className="absolute left-[42%] top-[18%] hidden h-9 w-9 rotate-12 sm:block lg:left-[38%] lg:top-[16%]" />
        <MotionLines className="absolute left-[8%] top-[42%] hidden rotate-[-8deg] text-ink/80 lg:block" />
      </div>

      {/* PLAN 4 — nav full-bleed */}
      <header className="relative z-40 flex items-start justify-between gap-3 px-3 pt-3 sm:px-6 sm:pt-4 lg:px-8 lg:pt-5">
        <div className="flex flex-col gap-2 sm:gap-3">
          <BrandWordmark
            subtitle="Wear"
            className="[&>span:first-child]:text-[clamp(1.85rem,7.5vw,4.6rem)] [&>span:first-child]:[-webkit-text-stroke-width:3px] sm:[&>span:first-child]:[-webkit-text-stroke-width:4px] [&>span:last-child]:text-[clamp(1rem,3.6vw,2.15rem)]"
          />
          <nav className="hidden items-center gap-4 text-sm font-bold uppercase tracking-wide text-ink/80 lg:flex">
            <span className="hover:text-hot-pink">Shop</span>
            <Link href="/create" className="hover:text-hot-pink">
              Create
            </Link>
            <Link href="/mentions-legales" className="hover:text-hot-pink">
              Mentions
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <BadgeAge />
          <Link
            href="/create"
            className="hidden rounded-pill border-[3px] border-ink bg-hot-pink px-4 py-2 font-display text-xs font-bold uppercase tracking-tight text-white shadow-sticker-sm transition-transform duration-[var(--duration-button)] hover:translate-x-px hover:translate-y-px sm:inline-flex lg:text-sm"
          >
            Create →
          </Link>
        </div>
      </header>

      {/* Core composition: titres + modèles + promesses — centered, max 1700px */}
      <div className="pointer-events-none absolute inset-0 z-30 mx-auto w-full max-w-[1500px]">
        <HeroModels />
        <ScatteredBrainrots />

        <div
          className={[
            "pointer-events-auto relative z-30 flex flex-col",
            "max-w-[100%] gap-1.5 px-3 pt-[4.75rem] pb-[calc(52dvh+4.75rem)]",
            "sm:max-w-md sm:gap-4 sm:px-6 sm:pt-[5.5rem] sm:pb-[calc(30dvh+6rem)]",
            "lg:h-full lg:max-w-xl lg:justify-center lg:gap-5 lg:px-8 lg:pb-36 lg:pt-28",
            "xl:max-w-2xl",
          ].join(" ")}
        >
          <h1 className="rotate-[-2deg] font-display font-bold uppercase leading-[0.8] tracking-[-0.05em] text-[clamp(2.1rem,9vw,6.2rem)]">
            <span
              className="block whitespace-nowrap text-white"
              style={{
                WebkitTextStroke: "3.5px #0a0a0a",
                paintOrder: "stroke fill",
                textShadow: "5px 5px 0 #0a0a0a",
              }}
            >
              Des t-shirts
            </span>
            <span
              className="mt-0.5 block whitespace-nowrap text-hot-pink sm:mt-1"
              style={{
                WebkitTextStroke: "3.5px #0a0a0a",
                paintOrder: "stroke fill",
                textShadow: "5px 5px 0 #0a0a0a",
              }}
            >
              Brainrot
            </span>
            <span
              className="mt-0.5 block whitespace-nowrap text-white sm:mt-1"
              style={{
                WebkitTextStroke: "3.5px #0a0a0a",
                paintOrder: "stroke fill",
                textShadow: "5px 5px 0 #0a0a0a",
              }}
            >
              qui envoient&nbsp;!
            </span>
          </h1>

          <p className="hidden font-display text-base font-bold uppercase leading-tight tracking-[-0.03em] text-ink sm:block lg:text-lg">
            Drôles. Colorés.{" "}
            <span className="text-ultraviolet">100% Brainrototo.</span>
          </p>

          <p className="hidden max-w-md font-sans text-sm font-bold leading-snug text-ink/80 sm:block lg:text-[0.95rem]">
            Des t-shirts originaux pour les 10-16 ans qui aiment rire, se
            démarquer et kiffer leur style.
          </p>

          <div className="relative mt-0.5 sm:mt-1">
            <ArrowDoodle className="absolute -left-1 -top-8 hidden rotate-[-18deg] sm:-left-7 sm:block" />
            <ScribbleNote className="absolute -right-2 -top-6 hidden sm:block lg:-right-3 lg:-top-7">
              go custom
            </ScribbleNote>
            <Link
              href="/create"
              className="inline-flex items-center justify-center gap-2 rounded-pill border-[3px] border-ink bg-hot-pink px-5 py-2.5 font-display text-sm font-bold uppercase tracking-tight text-white shadow-sticker transition-[transform,box-shadow] duration-[var(--duration-button)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-sticker-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hot-pink focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffdf8] sm:px-8 sm:py-4 sm:text-base lg:text-lg"
            >
              Découvrir la collection →
            </Link>
          </div>
        </div>

        <PromisesBar />
      </div>

      <nav className="pointer-events-auto absolute bottom-3 left-0 right-0 z-40 flex justify-center gap-3 px-3 text-[0.65rem] font-bold uppercase tracking-wide text-ink/45 sm:gap-4">
        <Link href="/mentions-legales" className="hover:text-hot-pink">
          Mentions
        </Link>
        <Link href="/cgv" className="hover:text-hot-pink">
          CGV
        </Link>
        <Link href="/confidentialite" className="hover:text-hot-pink">
          Confidentialité
        </Link>
      </nav>
    </main>
  );
}

function BadgeAge() {
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-pill border-[3px] border-ink bg-ultraviolet px-2 py-1 font-display text-[0.6rem] font-bold uppercase tracking-tight text-white shadow-sticker-sm sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-[0.7rem]">
      <svg
        aria-hidden
        viewBox="0 0 20 20"
        className="h-3 w-3 fill-acid-yellow stroke-ink stroke-2 sm:h-3.5 sm:w-3.5"
      >
        <path d="M10 1.5l2.1 5.6 6 .3-4.6 3.8 1.6 5.8L10 13.8 4.9 17l1.6-5.8L2 7.4l6-.3L10 1.5z" />
      </svg>
      <span className="sm:hidden">10-16</span>
      <span className="hidden sm:inline">10-16 ans</span>
    </span>
  );
}
