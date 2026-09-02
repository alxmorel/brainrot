import type { Metadata } from "next";
import { heroH } from "@/features/home/HeroCopy";
import { HeroModels } from "@/features/home/HeroModels";
import { NotFoundHero } from "@/features/home/NotFoundHero";
import { PromisesBar } from "@/features/home/PromisesBar";
import { ScatteredBrainrots } from "@/features/home/ScatteredBrainrots";
import { SiteFooter } from "@/shared/components/layout/SiteFooter";
import { SiteNav } from "@/shared/components/layout/SiteNav";

export const metadata: Metadata = {
  title: "404",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteNav />
      <main>
        <section className={`relative overflow-hidden bg-[#fffdf8] ${heroH}`}>
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

          <div className="relative z-30 mx-auto w-full max-w-[1760px]">
            <ScatteredBrainrots />
            <NotFoundHero />
            <HeroModels />
          </div>
        </section>
        <PromisesBar />
      </main>
      <SiteFooter />
    </div>
  );
}
