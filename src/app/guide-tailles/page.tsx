import type { Metadata } from "next";
import { gelatoTee } from "@/data/fulfillment";
import { SizeGuideTable } from "@/features/product/SizeGuide";
import { SiteFooter } from "@/shared/components/layout/SiteFooter";
import { SiteNav } from "@/shared/components/layout/SiteNav";

export const metadata: Metadata = {
  title: "Guide des tailles - Brainrototo.com",
  description: `Guide des tailles du t-shirt bio unisexe ${gelatoTee.brand} ${gelatoTee.sku}.`,
};

export default function SizeGuidePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteNav />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-wide text-hot-pink">
          {gelatoTee.catalogName}
        </p>
        <h1 className="mt-2 font-display text-[clamp(1.8rem,4vw,2.8rem)] font-bold uppercase leading-none tracking-[-0.04em] text-ink">
          Guide des tailles
        </h1>
        <p className="mt-3 text-sm font-bold text-ink/70">
          {gelatoTee.fabric} · {gelatoTee.weight} · {gelatoTee.fit} ·{" "}
          {gelatoTee.colorLabel}.
        </p>
        <div className="mt-8 rounded-2xl border-[3px] border-ink bg-white p-4 shadow-sticker-sm sm:p-6">
          <SizeGuideTable />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
