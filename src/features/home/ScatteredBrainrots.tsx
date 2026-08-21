import Image from "next/image";
import Link from "next/link";
import { cn } from "@/shared/utils/cn";

const stickers = [
  {
    id: "banacrocodilo",
    name: "Banacrocodilo Bambino",
    src: "/assets/brainrots/banana-croc.png",
    className:
      "bottom-[18%] left-[-2%] w-[42vw] max-w-[140px] rotate-[-12deg] sm:bottom-[14%] sm:left-[1%] sm:max-w-[150px] lg:bottom-[6%] lg:left-[2%] lg:max-w-[180px]",
  },
  {
    id: "fragolafrogo",
    name: "Fragolafrogo",
    src: "/assets/brainrots/lemon-sloth.png",
    className:
      "right-[0%] top-[8%] w-[42vw] max-w-[140px] rotate-[10deg] sm:max-w-[140px] lg:top-[6%] lg:max-w-[170px]",
  },
] as const;

export function ScatteredBrainrots({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 z-20 hidden sm:block", className)}>
      {stickers.map((sticker) => (
        <Link
          key={sticker.id}
          href={`/tee/${sticker.id}`}
          aria-label={`Porter ${sticker.name}`}
          className={cn(
            "absolute transition-transform duration-[var(--duration-card)] hover:scale-105 hover:rotate-0",
            sticker.className,
          )}
        >
          <Image
            src={sticker.src}
            alt={sticker.name}
            width={400}
            height={400}
            className="h-auto w-full drop-shadow-[5px_5px_0_rgba(10,10,10,0.28)]"
          />
        </Link>
      ))}
    </div>
  );
}
