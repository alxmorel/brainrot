import { HeroCopy, heroH } from "@/features/home/HeroCopy";
import { HeroModels } from "@/features/home/HeroModels";
import { HomeBestsellers } from "@/features/home/HomeBestsellers";
import { HomeHowItWorks } from "@/features/home/HomeHowItWorks";
import { HomeManifesto } from "@/features/home/HomeManifesto";
import { PromisesBar } from "@/features/home/PromisesBar";
import { ScatteredBrainrots } from "@/features/home/ScatteredBrainrots";
import { SiteFooter } from "@/shared/components/layout/SiteFooter";
import { SiteNav } from "@/shared/components/layout/SiteNav";
import type { Brainrototo } from "@/models";

export function HomeCampaign({
  bestsellers,
}: {
  bestsellers: Brainrototo[];
}) {
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
            <HeroCopy />
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
