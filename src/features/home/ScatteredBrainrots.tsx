"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/shared/utils/cn";

const stickers = [
  {
    id: "banacrocodilo",
    name: "Banacrocodilo Bambino",
    src: "/assets/brainrots/banana-croc.png",
    className:
      "bottom-[12%] left-[-4%] w-[38vw] max-w-[120px] sm:bottom-[0%] sm:left-0 sm:max-w-[250px] lg:bottom-1 lg:left-[35%] lg:max-w-[200px] xl:bottom-2 xl:left-[25%] xl:max-w-[250px]",
    rotate: -12,
    delay: 0.38,
  },
  {
    id: "fragolafrogo",
    name: "Fragolafrogo",
    src: "/assets/brainrots/lemon-sloth.png",
    className:
      "right-[0%] top-[8%] w-[42vw] max-w-[140px] sm:max-w-[250px] lg:top-[4%] lg:right-[0%] lg:w-[14vw] lg:max-w-[180px] xl:max-w-[250px]",
    rotate: 10,
    delay: 0.48,
  },
] as const;

export function ScatteredBrainrots({ className }: { className?: string }) {
  const reduced = useReducedMotion();

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-40 hidden sm:block",
        className,
      )}
    >
      {stickers.map((sticker) => (
        <motion.div
          key={sticker.id}
          initial={
            reduced
              ? false
              : { opacity: 0, scale: 0.6, rotate: sticker.rotate - 18 }
          }
          animate={{ opacity: 1, scale: 1, rotate: sticker.rotate }}
          transition={{
            duration: reduced ? 0.01 : 0.4,
            delay: reduced ? 0 : sticker.delay,
            ease: [0.34, 1.4, 0.64, 1],
          }}
          className={cn("pointer-events-auto absolute", sticker.className)}
        >
          <Link
            href={`/tee/${sticker.id}`}
            aria-label={`Voir ${sticker.name}`}
            className="block transition-transform duration-[var(--duration-card)] hover:scale-105 hover:rotate-0"
          >
            <Image
              src={sticker.src}
              alt={sticker.name}
              width={400}
              height={400}
              className="h-auto w-full drop-shadow-[5px_5px_0_rgba(10,10,10,0.28)]"
            />
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
