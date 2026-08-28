import { archiveCopy } from "@/data/archive";
import { ArchivePortrait } from "@/features/archive/ArchivePortrait";
import { ArchiveVideoEmbed } from "@/features/archive/ArchiveVideoEmbed";
import type { ArchiveCharacter } from "@/models";
import { Doodle } from "@/shared/components/brand/Doodle";

export function ArchiveMediaSheet({ character }: { character: ArchiveCharacter }) {
  return (
    <div className="relative rounded-[1.75rem] border-[3px] border-ink bg-white p-3 shadow-sticker sm:p-4">
      <Doodle kind="star" className="-right-3 -top-4 hidden sm:block" />
      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="relative motion-safe:lg:-rotate-1">
          <span className="absolute -top-2 left-3 z-10 rounded-pill border-[3px] border-ink bg-acid-yellow px-2.5 py-0.5 font-display text-[0.6rem] font-bold uppercase tracking-wide text-ink shadow-sticker-sm">
            {archiveCopy.portraitLabel}
          </span>
          <ArchivePortrait
            src={character.image}
            alt={character.name}
            tone={character.stickerTone}
            priority
            className="aspect-square"
          />
        </div>
        {character.video ? (
          <div className="relative mx-auto w-full max-w-[260px] motion-safe:lg:rotate-1">
            <span className="absolute -top-2 left-3 z-10 rounded-pill border-[3px] border-ink bg-hot-pink px-2.5 py-0.5 font-display text-[0.6rem] font-bold uppercase tracking-wide text-white shadow-sticker-sm">
              {archiveCopy.clipLabel}
            </span>
            <ArchiveVideoEmbed video={character.video} className="pt-3" />
          </div>
        ) : null}
      </div>
      <p className="mt-3 text-[0.65rem] font-bold leading-relaxed text-ink/45">
        {archiveCopy.imageCredit}
        {character.video ? ` ${archiveCopy.videoNote}` : null}
      </p>
    </div>
  );
}
