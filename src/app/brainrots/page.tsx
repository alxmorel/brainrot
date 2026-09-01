import type { Metadata } from "next";
import { archiveCharacters } from "@/data/archive";
import { brand } from "@/data/brand";
import { ArchiveCharacterGrid } from "@/features/archive/ArchiveCharacterGrid";
import { ArchiveJsonLd } from "@/features/archive/ArchiveJsonLd";
import { ArchiveLocalNav } from "@/features/archive/ArchiveLocalNav";
import { ArchiveShell } from "@/features/archive/ArchiveShell";

export const metadata: Metadata = {
  title: "The Brainrot Archive",
  description: brand.archive.indexLead,
  alternates: { canonical: "/brainrots" },
  openGraph: {
    title: "The Brainrot Archive - Brainrototo",
    description: brand.archive.indexLead,
    url: "/brainrots",
  },
};

export default function BrainrotsIndexPage() {
  return (
    <ArchiveShell wide>
      <ArchiveJsonLd
        title="The Brainrot Archive"
        description={brand.archive.indexLead}
        path="/brainrots"
      />
      <ArchiveLocalNav current="characters" />
      <p className="mt-6 text-xs font-bold uppercase tracking-wide text-hot-pink">
        {brand.archive.eyebrow}
      </p>
      <h1 className="mt-2 font-display text-[clamp(1.8rem,5vw,3rem)] font-bold uppercase leading-none tracking-[-0.04em] text-ink">
        {brand.archive.indexTitle}
      </h1>
      <p className="mt-2 font-display text-base font-bold text-ink/70">
        {brand.archive.tagline}
      </p>
      <p className="mt-3 text-sm font-bold leading-relaxed text-ink/75">
        {brand.archive.indexLead}
      </p>
      <div className="mt-8">
        <ArchiveCharacterGrid characters={archiveCharacters} />
      </div>
    </ArchiveShell>
  );
}
