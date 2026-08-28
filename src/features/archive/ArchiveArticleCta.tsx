import { archiveCopy } from "@/data/archive";
import { ComposeLink } from "@/shared/components/layout/ComposeLink";

export function ArchiveArticleCta() {
  return (
    <aside className="mt-8 rounded-2xl border-[3px] border-dashed border-ink/25 bg-ink-soft/40 px-4 py-3 sm:px-5">
      <p className="text-sm font-bold leading-relaxed text-ink/65">
        {archiveCopy.articleCtaBody}
      </p>
      <ComposeLink
        cta="composer"
        source="archive-article"
        className="mt-3 inline-flex rounded-pill border-[3px] border-ink bg-hot-pink px-4 py-2 font-display text-sm font-bold uppercase text-white shadow-sticker"
      >
        {archiveCopy.composeCta}
      </ComposeLink>
    </aside>
  );
}
