import Image from "next/image";
import Link from "next/link";
import { archiveCopy } from "@/data/archive";
import { ComposeLink } from "@/shared/components/layout/ComposeLink";
import type { ArchiveArticle, ArchiveCharacter } from "@/models";

export function ArchiveRelatedLinks({
  links,
}: {
  links: { character: ArchiveCharacter; reason: string }[];
}) {
  if (links.length === 0) return null;

  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {links.map(({ character, reason }) => (
        <li key={character.slug}>
          <Link
            href={`/brainrots/${character.slug}`}
            className="flex h-full gap-3 rounded-2xl border-[3px] border-ink bg-white p-3 shadow-sticker-sm hover:bg-acid-yellow sm:flex-col sm:gap-2"
          >
            <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-[3px] border-ink bg-white sm:aspect-square sm:h-auto sm:w-full">
              <Image
                src={character.image}
                alt={character.name}
                fill
                sizes="(min-width: 640px) 220px, 80px"
                className="object-contain p-1.5"
              />
            </span>
            <span className="min-w-0">
              <p className="font-display text-sm font-bold uppercase leading-tight tracking-[-0.03em] text-ink">
                {character.name}
              </p>
              <p className="mt-1 text-xs font-bold leading-snug text-ink/65">
                {reason}
              </p>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function ArchiveRelatedCharacters({
  characters,
}: {
  characters: ArchiveCharacter[];
}) {
  if (characters.length === 0) return null;

  return (
    <ul className="grid gap-3 sm:grid-cols-3">
      {characters.map((character) => (
        <li key={character.slug}>
          <Link
            href={`/brainrots/${character.slug}`}
            className="flex h-full flex-col rounded-2xl border-[3px] border-ink bg-white p-3 shadow-sticker-sm hover:bg-acid-yellow"
          >
            <span className="relative mb-2 block aspect-square overflow-hidden rounded-xl border-[3px] border-ink bg-white">
              <Image
                src={character.image}
                alt={character.name}
                fill
                sizes="200px"
                className="object-contain p-1.5"
              />
            </span>
            <p className="font-display text-sm font-bold uppercase leading-tight tracking-[-0.03em] text-ink">
              {character.name}
            </p>
            <p className="mt-1 text-xs font-bold leading-snug text-ink/60">
              {character.factSheet.type}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function ArchiveRelatedArticles({
  articles,
}: {
  articles: ArchiveArticle[];
}) {
  if (articles.length === 0) return null;

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {articles.map((article) => (
        <li key={article.slug}>
          <Link
            href={`/blog/${article.slug}`}
            className="flex h-full gap-3 rounded-2xl border-[3px] border-ink bg-white p-3 shadow-sticker-sm hover:bg-acid-yellow"
          >
            <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-[3px] border-ink bg-white">
              <Image
                src={article.image}
                alt={article.imageAlt}
                fill
                sizes="64px"
                className="object-contain p-1"
              />
            </span>
            <span>
              <p className="font-display text-sm font-bold uppercase leading-tight tracking-[-0.03em] text-ink">
                {article.title}
              </p>
              <p className="mt-1 text-xs font-bold leading-snug text-ink/60">
                {article.tagline}
              </p>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
