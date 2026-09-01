import Image from "next/image";
import Link from "next/link";
import { archiveCopy } from "@/data/archive";
import { ComposeLink } from "@/shared/components/layout/ComposeLink";
import type { Brainrototo } from "@/models";

export function ArchiveWearCta({
  disclaimer,
  originals,
}: {
  disclaimer: string;
  originals: Brainrototo[];
}) {
  return (
    <section className="rounded-2xl border-[3px] border-ink bg-ink-soft p-4 sm:p-5">
      <h2 className="font-display text-lg font-bold uppercase text-ink">
        {archiveCopy.brainrototoTitle}
      </h2>
      <p className="mt-2 text-sm font-bold leading-relaxed text-ink/70">
        {disclaimer}
      </p>
      {originals.length > 0 ? (
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {originals.map((brainrot) => (
            <li key={brainrot.id}>
              <Link
                href={`/tee/${brainrot.id}`}
                className="flex h-full flex-col items-center rounded-2xl border-[3px] border-ink bg-white p-3 shadow-sticker-sm hover:bg-acid-yellow"
              >
                <Image
                  src={brainrot.image}
                  alt={brainrot.name}
                  width={160}
                  height={160}
                  className="h-24 w-24 object-contain"
                />
                <p className="mt-2 text-center font-display text-sm font-bold uppercase leading-tight text-ink">
                  {brainrot.name}
                </p>
                <p className="mt-1 font-display text-[0.65rem] font-bold uppercase text-hot-pink">
                  {archiveCopy.seeTee}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
      <ComposeLink
        cta="composer"
        source="archive-wear"
        className="mt-4 inline-flex rounded-pill border-[3px] border-ink bg-hot-pink px-4 py-2 font-display text-sm font-bold uppercase text-white shadow-sticker"
      >
        {archiveCopy.composeCta}
      </ComposeLink>
    </section>
  );
}
