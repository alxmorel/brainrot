import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { archiveArticles } from "@/data/archive";
import { brand } from "@/data/brand";
import { ArchiveJsonLd } from "@/features/archive/ArchiveJsonLd";
import { ArchiveLocalNav } from "@/features/archive/ArchiveLocalNav";
import { ArchiveShell } from "@/features/archive/ArchiveShell";

export const metadata: Metadata = {
  title: brand.archive.blogTitle,
  description: brand.archive.blogLead,
  alternates: { canonical: "/blog" },
  openGraph: {
    title: `${brand.archive.blogTitle} - Brainrototo`,
    description: brand.archive.blogLead,
    url: "/blog",
  },
};

export default function BlogIndexPage() {
  return (
    <ArchiveShell>
      <ArchiveJsonLd
        title={brand.archive.blogTitle}
        description={brand.archive.blogLead}
        path="/blog"
      />
      <ArchiveLocalNav current="blog" />
      <p className="mt-6 text-xs font-bold uppercase tracking-wide text-hot-pink">
        {brand.archive.eyebrow}
      </p>
      <h1 className="mt-2 font-display text-[clamp(1.8rem,5vw,3rem)] font-bold uppercase leading-none tracking-[-0.04em] text-ink">
        {brand.archive.blogTitle}
      </h1>
      <p className="mt-3 text-sm font-bold leading-relaxed text-ink/75">
        {brand.archive.blogLead}
      </p>
      <ul className="mt-8 flex flex-col gap-3">
        {archiveArticles.map((article) => (
          <li key={article.slug}>
            <Link
              href={`/blog/${article.slug}`}
              className="flex gap-4 rounded-2xl border-[3px] border-ink bg-white p-3 shadow-sticker-sm hover:bg-acid-yellow sm:p-4"
            >
              <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-[3px] border-ink bg-white sm:h-24 sm:w-24">
                <Image
                  src={article.image}
                  alt={article.imageAlt}
                  fill
                  sizes="96px"
                  className="object-contain p-1"
                />
              </span>
              <span className="min-w-0">
                <p className="text-[0.65rem] font-bold uppercase tracking-wide text-hot-pink">
                  {article.kicker}
                </p>
                <p className="mt-1 font-display text-xl font-bold uppercase leading-none tracking-[-0.03em] text-ink">
                  {article.title}
                </p>
                <p className="mt-2 text-sm font-bold leading-snug text-ink/70">
                  {article.tagline}
                </p>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </ArchiveShell>
  );
}
