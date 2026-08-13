import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/utils/cn";
import { Surface } from "./Surface";

export type CardPack = "sunset" | "ocean" | "acid" | "candy";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
  interactive?: boolean;
  pack?: CardPack;
  media?: ReactNode;
  title?: string;
  meta?: ReactNode;
  children?: ReactNode;
}

const packClass: Record<CardPack, string> = {
  sunset: "bg-sunset",
  ocean: "bg-ocean",
  acid: "bg-acid",
  candy: "bg-candy",
};

export function Card({
  selected = false,
  interactive = true,
  pack = "sunset",
  media,
  title,
  meta,
  children,
  className,
  ...props
}: CardProps) {
  return (
    <Surface
      variant={selected ? "holo" : "sticker"}
      padded={false}
      className={cn(
        "group flex flex-col !rotate-0",
        interactive &&
          "transition-[transform,box-shadow] duration-[var(--duration-card)] ease-[var(--ease-out)] hover:-translate-y-1 hover:rotate-[-1.5deg] hover:shadow-sticker focus-within:-translate-y-1",
        selected && "rotate-[-1deg] shadow-sticker",
        className,
      )}
      {...props}
    >
      {media ? (
        <div
          className={cn(
            "relative aspect-[4/5] overflow-hidden border-b-[3px] border-ink glossy",
            packClass[pack],
          )}
        >
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(255_255_255/0.28)_0%,transparent_40%,rgb(10_10_10/0.08)_100%)]" />
          <div className="relative z-10 flex h-full items-center justify-center p-4">
            {media}
          </div>
        </div>
      ) : null}

      <div className="flex flex-1 flex-col gap-3 bg-white p-4 sm:p-5">
        {meta}
        {title ? (
          <h3 className="font-display text-2xl font-bold leading-none text-ink">
            {title}
          </h3>
        ) : null}
        {children}
      </div>
    </Surface>
  );
}
