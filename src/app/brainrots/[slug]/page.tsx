import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  archiveCharacters,
  getArchiveCharacter,
  getRelatedArchiveCharacterLinks,
} from "@/data/archive";
import { brand } from "@/data/brand";
import { brainrots } from "@/data/brainrots";
import { ArchiveCharacterView } from "@/features/archive/ArchiveCharacterView";
import { ArchiveJsonLd } from "@/features/archive/ArchiveJsonLd";
import { ArchiveLocalNav } from "@/features/archive/ArchiveLocalNav";
import { ArchiveShell } from "@/features/archive/ArchiveShell";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return archiveCharacters.map((character) => ({ slug: character.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const character = getArchiveCharacter(slug);
  if (!character) return { title: "Archive" };
  const path = `/brainrots/${character.slug}`;
  return {
    title: character.seoTitle,
    description: character.seoDescription,
    alternates: { canonical: path },
    openGraph: {
      title: `${character.seoTitle} - Brainrototo`,
      description: character.seoDescription,
      url: path,
      images: [{ url: character.image, alt: character.name }],
    },
  };
}

export default async function ArchiveCharacterRoute({ params }: PageProps) {
  const { slug } = await params;
  const character = getArchiveCharacter(slug);
  if (!character) notFound();
  const related = getRelatedArchiveCharacterLinks(character.relatedLinks);
  const originals = character.relatedOriginalIds
    .map((id) => brainrots.find((item) => item.id === id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const path = `/brainrots/${character.slug}`;

  return (
    <ArchiveShell wide>
      <ArchiveJsonLd
        title={character.seoTitle}
        description={character.seoDescription}
        path={path}
      />
      <ArchiveLocalNav current="characters" />
      <p className="mt-6 text-xs font-bold uppercase tracking-wide text-ink/40">
        {brand.archive.eyebrow}
      </p>
      <div className="mt-2">
        <ArchiveCharacterView
          character={character}
          related={related}
          originals={originals}
        />
      </div>
    </ArchiveShell>
  );
}
