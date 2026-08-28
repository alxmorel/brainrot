import { archiveCopy } from "@/data/archive";
import type { ArchiveVideo } from "@/models";
import { cn } from "@/shared/utils/cn";

function buildTikTokPlayerSrc(videoId: string) {
  const params = new URLSearchParams({
    rel: "0",
    music_info: "0",
    description: "0",
    autoplay: "0",
  });

  return `https://www.tiktok.com/player/v1/${videoId}?${params.toString()}`;
}

export function ArchiveVideoEmbed({
  video,
  className,
}: {
  video: ArchiveVideo;
  className?: string;
}) {
  return (
    <figure className={cn("flex w-full flex-col items-center", className)}>
      <div className="w-full max-w-[260px] overflow-hidden rounded-2xl border-[3px] border-ink bg-black shadow-sticker-sm">
        <div className="aspect-[9/16] w-full">
          <iframe
            src={buildTikTokPlayerSrc(video.videoId)}
            title={`Vidéo TikTok - @${video.creator}`}
            className="h-full w-full border-0"
            allow="fullscreen"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>
      <figcaption className="mt-2 text-center text-[0.65rem] font-bold leading-snug text-ink/50">
        @{video.creator}
      </figcaption>
      <a
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1 text-xs font-bold text-hot-pink underline decoration-2 underline-offset-2 hover:text-ink"
      >
        {archiveCopy.videoOpen}
      </a>
    </figure>
  );
}
