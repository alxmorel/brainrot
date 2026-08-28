import Image from "next/image";
import type { ArchiveStickerTone } from "@/models";
import { cn } from "@/shared/utils/cn";

const toneClass: Record<ArchiveStickerTone, string> = {
  pink: "bg-hot-pink",
  cyan: "bg-electric-cyan",
  green: "bg-acid-green",
  orange: "bg-fluoro-orange",
  violet: "bg-ultraviolet",
  yellow: "bg-acid-yellow",
  blue: "bg-blue",
};

export function ArchivePortrait({
  src,
  alt,
  tone = "yellow",
  className,
  sizes = "(max-width: 672px) 100vw, 672px",
  priority = false,
}: {
  src: string;
  alt: string;
  tone?: ArchiveStickerTone;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border-[3px] border-ink shadow-sticker",
        toneClass[tone],
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-contain p-3"
      />
    </div>
  );
}
