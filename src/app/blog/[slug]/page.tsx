import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  archiveArticles,
  getArchiveArticle,
  getRelatedArchiveArticles,
  getRelatedArchiveCharacters,
} from "@/data/archive";
import { ArchiveArticleView } from "@/features/archive/ArchiveArticleView";
import { ArchiveJsonLd } from "@/features/archive/ArchiveJsonLd";
import { ArchiveLocalNav } from "@/features/archive/ArchiveLocalNav";
import { ArchiveShell } from "@/features/archive/ArchiveShell";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return archiveArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArchiveArticle(slug);
  if (!article) return { title: "Blog" };
  const path = `/blog/${article.slug}`;
  return {
    title: article.seoTitle,
    description: article.seoDescription,
    alternates: { canonical: path },
    openGraph: {
      title: `${article.seoTitle} - Brainrototo`,
      description: article.seoDescription,
      url: path,
      images: [{ url: article.image, alt: article.imageAlt }],
    },
  };
}

export default async function ArchiveArticleRoute({ params }: PageProps) {
  const { slug } = await params;
  const article = getArchiveArticle(slug);
  if (!article) notFound();
  const relatedCharacters = getRelatedArchiveCharacters(article.relatedCharacterSlugs);
  const relatedArticles = getRelatedArchiveArticles(article.relatedArticleSlugs);
  const path = `/blog/${article.slug}`;
  const wide = article.kind === "family-tree";

  return (
    <ArchiveShell wide={wide}>
      <ArchiveJsonLd
        title={article.seoTitle}
        description={article.seoDescription}
        path={path}
      />
      <ArchiveLocalNav current="blog" />
      <div className="mt-6">
        <ArchiveArticleView
          article={article}
          relatedCharacters={relatedCharacters}
          relatedArticles={relatedArticles}
        />
      </div>
    </ArchiveShell>
  );
}
