"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { archiveCopy, archiveFilters, type ArchiveFilterId } from "@/data/archive";
import type { ArchiveCharacter } from "@/models";
import { cn } from "@/shared/utils/cn";

function matchesFilter(character: ArchiveCharacter, filter: ArchiveFilterId) {
  if (filter === "all") return true;
  if (filter === "italian" || filter === "indonesian" || filter === "international") {
    return character.wave === filter;
  }
  return character.tags.includes(filter);
}

export function ArchiveCharacterGrid({
  characters,
}: {
  characters: ArchiveCharacter[];
}) {
  const [filter, setFilter] = useState<ArchiveFilterId>("all");
  const visible = useMemo(
    () => characters.filter((character) => matchesFilter(character, filter)),
    [characters, filter],
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {archiveFilters.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className={cn(
              "rounded-pill border-[3px] border-ink px-3 py-1 font-display text-xs font-bold uppercase tracking-tight shadow-sticker-sm",
              filter === id
                ? "bg-hot-pink text-white"
                : "bg-white text-ink hover:bg-acid-yellow",
            )}
          >
            {archiveCopy.filters[id]}
          </button>
        ))}
      </div>
      {visible.length === 0 ? (
        <p className="mt-6 text-sm font-bold text-ink/60">{archiveCopy.emptyFilter}</p>
      ) : (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {visible.map((character) => (
            <li key={character.slug}>
              <Link
                href={`/brainrots/${character.slug}`}
                className="flex h-full flex-col rounded-2xl border-[3px] border-ink bg-white p-4 shadow-sticker-sm hover:bg-acid-yellow"
              >
                <span className="relative mb-3 block aspect-square overflow-hidden rounded-xl border-[3px] border-ink bg-white">
                  <Image
                    src={character.image}
                    alt={character.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 320px"
                    className="object-contain p-2"
                  />
                </span>
                <p className="text-[0.65rem] font-bold uppercase tracking-wide text-hot-pink">
                  {archiveCopy.waveLabel[character.wave]}
                </p>
                <p className="mt-1 font-display text-xl font-bold uppercase leading-none tracking-[-0.03em] text-ink">
                  {character.name}
                </p>
                <p className="mt-2 text-sm font-bold leading-snug text-ink/70">
                  {character.tagline}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
