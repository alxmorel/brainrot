import type { ReactNode } from "react";
import { archiveCopy } from "@/data/archive";
import { ArchiveMediaSheet } from "@/features/archive/ArchiveMediaSheet";
import { ArchiveRelatedLinks } from "@/features/archive/ArchiveRelated";
import { ArchiveWearCta } from "@/features/archive/ArchiveWearCta";
import type { ArchiveCharacter, Brainrototo } from "@/models";
import { cn } from "@/shared/utils/cn";

function NoteList({ items, marker }: { items: string[]; marker: "num" | "q" }) {
  return (
    <ol className="flex flex-col gap-3">
      {items.map((item, index) => (
        <li key={item.slice(0, 48)} className="flex gap-3">
          <span
            className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-[3px] border-ink bg-white font-display text-xs font-bold text-ink shadow-sticker-sm"
            aria-hidden
          >
            {marker === "num" ? index + 1 : "?"}
          </span>
          <p className="text-sm font-bold leading-snug text-ink/80">{item}</p>
        </li>
      ))}
    </ol>
  );
}

function FileCard({
  title,
  badge,
  tone,
  children,
}: {
  title: string;
  badge: string;
  tone: "green" | "yellow" | "purple";
  children: ReactNode;
}) {
  const header =
    tone === "green"
      ? "bg-acid-green text-ink"
      : tone === "yellow"
        ? "bg-acid-yellow text-ink"
        : "bg-ultraviolet text-white";

  return (
    <section className="overflow-hidden rounded-2xl border-[3px] border-ink bg-white shadow-sticker-sm">
      <header
        className={cn(
          "flex items-center justify-between gap-3 border-b-[3px] border-ink px-4 py-2.5",
          header,
        )}
      >
        <h2 className="font-display text-sm font-bold uppercase tracking-wide">{title}</h2>
        <span className="rounded-pill border-2 border-ink bg-white px-2 py-0.5 font-display text-[0.55rem] font-bold uppercase tracking-wide text-ink">
          {badge}
        </span>
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}

export function ArchiveCharacterView({
  character,
  related,
  originals,
}: {
  character: ArchiveCharacter;
  related: { character: ArchiveCharacter; reason: string }[];
  originals: Brainrototo[];
}) {
  const sheet = character.factSheet;
  const factChips = [
    [archiveCopy.factLabels.appearance, sheet.appearance],
    [archiveCopy.factLabels.period, sheet.period],
    [archiveCopy.factLabels.geographicOrigin, sheet.geographicOrigin],
    [archiveCopy.factLabels.brainrotFamily, sheet.brainrotFamily],
    [archiveCopy.factLabels.type, sheet.type],
  ] as const;

  return (
    <article>
      <p className="text-xs font-bold uppercase tracking-wide text-hot-pink">
        {archiveCopy.waveLabel[character.wave]}
      </p>
      <h1 className="mt-2 font-display text-[clamp(1.8rem,5vw,3rem)] font-bold uppercase leading-none tracking-[-0.04em] text-ink">
        {character.name}
      </h1>
      <p className="mt-3 font-display text-lg font-bold leading-snug text-ink/80">
        {character.tagline}
      </p>

      <div className="mt-6">
        <ArchiveMediaSheet character={character} />
      </div>

      <p className="mt-6 rounded-2xl border-[3px] border-ink bg-white px-4 py-3 text-sm font-bold leading-relaxed text-ink shadow-sticker-sm sm:px-5">
        {character.summary}
      </p>

      <ul className="mt-5 flex flex-wrap gap-2">
        {factChips.map(([label, value]) => (
          <li
            key={label}
            className="rounded-2xl border-[3px] border-ink bg-white px-3 py-2 shadow-sticker-sm"
          >
            <p className="text-[0.6rem] font-bold uppercase tracking-wide text-ink/40">
              {label}
            </p>
            <p className="mt-0.5 font-display text-sm font-bold uppercase leading-tight tracking-[-0.03em] text-ink">
              {value}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <section className="rounded-2xl border-[3px] border-ink bg-electric-cyan p-4 shadow-sticker-sm">
          <h2 className="font-display text-sm font-bold uppercase text-ink">
            {archiveCopy.appearanceTitle}
          </h2>
          <div className="mt-2 flex flex-col gap-2 text-sm font-bold leading-snug text-ink/80">
            {character.appearance.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
        </section>
        <section className="rounded-2xl border-[3px] border-ink bg-acid-yellow p-4 shadow-sticker-sm">
          <h2 className="font-display text-sm font-bold uppercase text-ink">
            {archiveCopy.whyBrainrotTitle}
          </h2>
          <div className="mt-2 flex flex-col gap-2 text-sm font-bold leading-snug text-ink/80">
            {character.whyBrainrot.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <FileCard title={archiveCopy.documentedTitle} badge="Faits" tone="green">
          <NoteList items={character.documented} marker="num" />
        </FileCard>
        {character.uncertain.length > 0 ? (
          <FileCard title={archiveCopy.uncertainTitle} badge="À confirmer" tone="yellow">
            <NoteList items={character.uncertain} marker="q" />
          </FileCard>
        ) : null}
        <FileCard title={archiveCopy.loreTitle} badge={archiveCopy.communityNote} tone="purple">
          <NoteList items={character.communityLore} marker="num" />
        </FileCard>
      </div>

      {related.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-display text-lg font-bold uppercase text-ink">
            {archiveCopy.relatedTitle}
          </h2>
          <div className="mt-3">
            <ArchiveRelatedLinks links={related} />
          </div>
        </section>
      ) : null}

      <div className="mt-8">
        <ArchiveWearCta
          disclaimer={character.brainrototoDisclaimer}
          originals={originals}
        />
      </div>
    </article>
  );
}
