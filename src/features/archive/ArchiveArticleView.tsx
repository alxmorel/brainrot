import { archiveCopy } from "@/data/archive";
import type { ArchiveArticle, ArchiveCharacter } from "@/models";
import { ArchiveArticleCta } from "@/features/archive/ArchiveArticleCta";
import { ArchiveFamilyTree } from "@/features/archive/ArchiveFamilyTree";
import { ArchivePortrait } from "@/features/archive/ArchivePortrait";
import {
  ArchiveRelatedArticles,
  ArchiveRelatedCharacters,
} from "@/features/archive/ArchiveRelated";

export function ArchiveArticleView({
  article,
  relatedCharacters,
  relatedArticles,
}: {
  article: ArchiveArticle;
  relatedCharacters: ArchiveCharacter[];
  relatedArticles: ArchiveArticle[];
}) {
  return (
    <article>
      <p className="text-xs font-bold uppercase tracking-wide text-hot-pink">
        {article.kicker}
      </p>
      <h1 className="mt-2 font-display text-[clamp(1.8rem,5vw,3rem)] font-bold uppercase leading-none tracking-[-0.04em] text-ink">
        {article.title}
      </h1>
      <p className="mt-3 font-display text-lg font-bold leading-snug text-ink/80">
        {article.tagline}
      </p>
      <p className="mt-5 text-sm font-bold leading-relaxed text-ink/80">
        {article.lead}
      </p>
      <div className="mt-6">
        <ArchivePortrait
          src={article.image}
          alt={article.imageAlt}
          className="aspect-[4/3]"
          priority
        />
        <p className="mt-2 text-[0.65rem] font-bold leading-relaxed text-ink/45">
          {archiveCopy.imageCredit}
        </p>
      </div>

      {article.sections.map((section) => (
        <section key={section.heading} className="mt-8">
          <h2 className="font-display text-lg font-bold uppercase text-ink">
            {section.heading}
          </h2>
          <div className="mt-2 flex flex-col gap-3 text-sm font-bold leading-relaxed text-ink/80">
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
        </section>
      ))}

      {article.kind === "family-tree" ? (
        <div className="mt-8">
          <ArchiveFamilyTree />
        </div>
      ) : null}

      <ArchiveArticleCta />

      {relatedCharacters.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-display text-lg font-bold uppercase text-ink">
            {archiveCopy.relatedTitle}
          </h2>
          <div className="mt-3">
            <ArchiveRelatedCharacters characters={relatedCharacters} />
          </div>
        </section>
      ) : null}

      {relatedArticles.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-display text-lg font-bold uppercase text-ink">
            {archiveCopy.allArticles}
          </h2>
          <div className="mt-3">
            <ArchiveRelatedArticles articles={relatedArticles} />
          </div>
        </section>
      ) : null}
    </article>
  );
}
