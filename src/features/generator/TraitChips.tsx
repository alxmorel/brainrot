"use client";

import type { ReactNode } from "react";
import type { Trait } from "@/models";
import { cn } from "@/shared/utils/cn";

const iconClass = "h-7 w-7 sm:h-8 sm:w-8";

function Svg({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 32 32" className={iconClass} aria-hidden>
      {children}
    </svg>
  );
}

const icons: Record<string, ReactNode> = {
  crocodile: (
    <Svg>
      <path d="M4 18h18l6-4v8H4z" fill="#7CFF00" stroke="#0a0a0a" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="24" cy="16" r="1.4" fill="#0a0a0a" />
    </Svg>
  ),
  chat: (
    <Svg>
      <path d="M8 14 6 7l7 4h6l7-4-2 7v8H8z" fill="#FF2FB3" stroke="#0a0a0a" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="13" cy="17" r="1.3" fill="#0a0a0a" />
      <circle cx="19" cy="17" r="1.3" fill="#0a0a0a" />
    </Svg>
  ),
  grenouille: (
    <Svg>
      <circle cx="16" cy="18" r="8" fill="#7CFF00" stroke="#0a0a0a" strokeWidth="2.5" />
      <circle cx="12" cy="12" r="3.2" fill="#fff" stroke="#0a0a0a" strokeWidth="2" />
      <circle cx="20" cy="12" r="3.2" fill="#fff" stroke="#0a0a0a" strokeWidth="2" />
      <circle cx="12" cy="12" r="1.2" fill="#0a0a0a" />
      <circle cx="20" cy="12" r="1.2" fill="#0a0a0a" />
    </Svg>
  ),
  requin: (
    <Svg>
      <path d="M5 18c8-2 12-8 22-6-6 4-8 10-22 10z" fill="#3155FF" stroke="#0a0a0a" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M16 12v-5l5 5" fill="#3155FF" stroke="#0a0a0a" strokeWidth="2.5" strokeLinejoin="round" />
    </Svg>
  ),
  singe: (
    <Svg>
      <circle cx="16" cy="16" r="8" fill="#ff5a1f" stroke="#0a0a0a" strokeWidth="2.5" />
      <circle cx="9" cy="14" r="3" fill="#ffb38a" stroke="#0a0a0a" strokeWidth="2" />
      <circle cx="23" cy="14" r="3" fill="#ffb38a" stroke="#0a0a0a" strokeWidth="2" />
      <ellipse cx="16" cy="18" rx="5" ry="4" fill="#ffb38a" />
    </Svg>
  ),
  canard: (
    <Svg>
      <circle cx="14" cy="16" r="7" fill="#DFFF00" stroke="#0a0a0a" strokeWidth="2.5" />
      <path d="M20 16h7l-3 4h-4z" fill="#FF5A1F" stroke="#0a0a0a" strokeWidth="2.2" strokeLinejoin="round" />
      <circle cx="12" cy="14" r="1.2" fill="#0a0a0a" />
    </Svg>
  ),
  poulet: (
    <Svg>
      <circle cx="16" cy="18" r="8" fill="#DFFF00" stroke="#0a0a0a" strokeWidth="2.5" />
      <path d="M12 10 16 4l4 6" fill="#FF1E3C" stroke="#0a0a0a" strokeWidth="2.2" strokeLinejoin="round" />
      <circle cx="13" cy="16" r="1.2" fill="#0a0a0a" />
      <path d="M20 17h5l-2 3h-3z" fill="#FF5A1F" stroke="#0a0a0a" strokeWidth="2" strokeLinejoin="round" />
    </Svg>
  ),
  herisson: (
    <Svg>
      <circle cx="16" cy="18" r="7" fill="#ffb38a" stroke="#0a0a0a" strokeWidth="2.5" />
      <path d="M10 12 8 6l4 4M16 10 16 4l2 6M22 12 24 6l-4 4" fill="#7CFF00" stroke="#0a0a0a" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="13" cy="17" r="1.1" fill="#0a0a0a" />
      <circle cx="19" cy="17" r="1.1" fill="#0a0a0a" />
    </Svg>
  ),
  banane: (
    <Svg>
      <path d="M8 10c8-4 16 2 16 12-8 2-14-2-16-12z" fill="#DFFF00" stroke="#0a0a0a" strokeWidth="2.5" strokeLinejoin="round" />
    </Svg>
  ),
  fraise: (
    <Svg>
      <path d="M16 6c3 3 8 4 8 11 0 6-4 10-8 10s-8-4-8-10c0-7 5-8 8-11z" fill="#FF2FB3" stroke="#0a0a0a" strokeWidth="2.5" />
      <path d="M12 8c2-3 8-3 10 0" fill="#7CFF00" stroke="#0a0a0a" strokeWidth="2" />
    </Svg>
  ),
  pasteque: (
    <Svg>
      <path d="M6 22c2-10 18-10 20 0L16 26z" fill="#FF2FB3" stroke="#0a0a0a" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M7 21c2-8 16-8 18 0" fill="none" stroke="#7CFF00" strokeWidth="3" />
    </Svg>
  ),
  ananas: (
    <Svg>
      <path d="M16 10 10 28h12z" fill="#DFFF00" stroke="#0a0a0a" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M16 4c0 4-4 6-4 6h8s-4-2-4-6z" fill="#7CFF00" stroke="#0a0a0a" strokeWidth="2.2" strokeLinejoin="round" />
    </Svg>
  ),
  pomme: (
    <Svg>
      <circle cx="16" cy="18" r="8" fill="#FF1E3C" stroke="#0a0a0a" strokeWidth="2.5" />
      <path d="M16 10c0-4 4-5 5-5" fill="none" stroke="#0a0a0a" strokeWidth="2.2" strokeLinecap="round" />
    </Svg>
  ),
  pizza: (
    <Svg>
      <path d="M6 8h20L16 28z" fill="#DFFF00" stroke="#0a0a0a" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="14" cy="14" r="1.6" fill="#FF1E3C" />
      <circle cx="18" cy="18" r="1.6" fill="#FF1E3C" />
      <circle cx="13" cy="20" r="1.4" fill="#FF1E3C" />
    </Svg>
  ),
  citrouille: (
    <Svg>
      <path d="M8 14c0-6 4-8 8-8s8 2 8 8c0 8-4 12-8 12s-8-4-8-12z" fill="#FF5A1F" stroke="#0a0a0a" strokeWidth="2.5" />
      <path d="M16 6c0-3 2-4 3-4" fill="none" stroke="#7CFF00" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M12 16 14 20 16 16 18 20 20 16" fill="none" stroke="#0a0a0a" strokeWidth="2" strokeLinejoin="round" />
    </Svg>
  ),
  italian: (
    <Svg>
      <rect x="6" y="8" width="20" height="16" rx="2" fill="#fff" stroke="#0a0a0a" strokeWidth="2.5" />
      <path d="M6 8h6.6v16H6z" fill="#7CFF00" />
      <path d="M19.4 8H26v16h-6.6z" fill="#FF1E3C" />
    </Svg>
  ),
  cute: (
    <Svg>
      <circle cx="16" cy="16" r="10" fill="#FF2FB3" stroke="#0a0a0a" strokeWidth="2.5" />
      <path d="M10 14c2-4 4-4 6 0 2-4 4-4 6 0" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  ),
  cursed: (
    <Svg>
      <circle cx="16" cy="16" r="10" fill="#8b3dff" stroke="#0a0a0a" strokeWidth="2.5" />
      <path d="M11 13h3M18 13h3M12 21c2-2 6-2 8 0" stroke="#DFFF00" strokeWidth="2.2" strokeLinecap="round" />
    </Svg>
  ),
  chaotic: (
    <Svg>
      <path d="M18 4 8 18h8l-2 10 12-16h-8z" fill="#DFFF00" stroke="#0a0a0a" strokeWidth="2.5" strokeLinejoin="round" />
    </Svg>
  ),
  luxury: (
    <Svg>
      <path d="M6 12h20l-3 12H9z" fill="#3155FF" stroke="#0a0a0a" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M6 12 11 6h10l5 6" fill="none" stroke="#0a0a0a" strokeWidth="2.5" strokeLinejoin="round" />
    </Svg>
  ),
  assassin: (
    <Svg>
      <path d="M10 6 22 18M22 6 10 18" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M14 8 8 14l2 2 6-6z" fill="#8b3dff" stroke="#0a0a0a" strokeWidth="2" strokeLinejoin="round" />
      <path d="M18 8 24 14l-2 2-6-6z" fill="#8b3dff" stroke="#0a0a0a" strokeWidth="2" strokeLinejoin="round" />
    </Svg>
  ),
  chill: (
    <Svg>
      <circle cx="16" cy="16" r="10" fill="#00e5ff" stroke="#0a0a0a" strokeWidth="2.5" />
      <path d="M9 14h5M18 14h5" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M11 20c2 2 8 2 10 0" fill="none" stroke="#0a0a0a" strokeWidth="2.2" strokeLinecap="round" />
    </Svg>
  ),
  any: (
    <Svg>
      <circle cx="16" cy="16" r="10" fill="#fff" stroke="#0a0a0a" strokeWidth="2.5" />
      <path d="M10 16h12" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round" />
    </Svg>
  ),
};

export const traitStickerTone: Record<string, string> = {
  crocodile: "bg-acid-green",
  chat: "bg-hot-pink",
  grenouille: "bg-acid-green",
  requin: "bg-blue",
  singe: "bg-fluoro-orange",
  canard: "bg-acid-yellow",
  poulet: "bg-fluoro-orange",
  herisson: "bg-hot-pink",
  banane: "bg-acid-yellow",
  fraise: "bg-hot-pink",
  pasteque: "bg-acid-green",
  ananas: "bg-acid-yellow",
  pomme: "bg-red",
  pizza: "bg-fluoro-orange",
  citrouille: "bg-fluoro-orange",
  italian: "bg-white",
  cute: "bg-hot-pink",
  cursed: "bg-ultraviolet",
  chaotic: "bg-acid-yellow",
  luxury: "bg-blue",
  assassin: "bg-ultraviolet",
  chill: "bg-electric-cyan",
  any: "bg-white",
};

const lightTones = new Set([
  "bg-white",
  "bg-acid-yellow",
  "bg-acid-green",
  "bg-electric-cyan",
]);

export function traitToneText(traitId: string) {
  const tone = traitStickerTone[traitId] ?? "bg-acid-yellow";
  return lightTones.has(tone) ? "text-ink" : "text-white";
}

export function traitToneMuted(traitId: string) {
  return lightTones.has(traitStickerTone[traitId] ?? "")
    ? "text-ink/65"
    : "text-white/85";
}

const tilts = ["-rotate-6", "rotate-3", "-rotate-2", "rotate-6", "-rotate-4", "rotate-2"];

function TraitSticker({
  id,
  label,
  selected,
  tilt,
  compact,
  onClick,
}: {
  id: string;
  label: string;
  selected: boolean;
  tilt?: string;
  compact?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={label}
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1",
        compact ? "w-[3.6rem] lg:w-[4.75rem] xl:w-[5.5rem]" : "w-[4.25rem] sm:w-[4.75rem]",
        tilt,
        selected && "z-10 -rotate-2",
      )}
    >
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-xl border-[3px] border-ink shadow-sticker-sm transition-[transform,box-shadow] duration-[var(--duration-button)]",
          compact
            ? "h-11 w-11 [&>svg]:h-6 [&>svg]:w-6 lg:h-16 lg:w-16 lg:[&>svg]:h-9 lg:[&>svg]:w-9 xl:h-[4.5rem] xl:w-[4.5rem]"
            : "h-12 w-12 sm:h-14 sm:w-14",
          selected
            ? cn(traitStickerTone[id] ?? "bg-acid-yellow", "scale-110 shadow-sticker")
            : "bg-white hover:bg-ink-soft",
        )}
      >
        {icons[id]}
      </span>
      <span
        className={cn(
          "font-display font-bold uppercase leading-none tracking-tight",
          compact
            ? "text-[0.58rem] sm:text-xs lg:text-sm"
            : "text-[0.62rem] sm:text-xs lg:text-sm",
          selected ? "text-hot-pink" : "text-ink",
        )}
      >
        {label}
      </span>
    </button>
  );
}

export function TraitChips({
  label,
  traits,
  value,
  onChange,
  allowAny,
  compact,
  hideLabel,
}: {
  label: string;
  traits: Trait[];
  value: string | null;
  onChange: (id: string | null) => void;
  allowAny?: boolean;
  compact?: boolean;
  hideLabel?: boolean;
}) {
  return (
    <fieldset>
      {hideLabel ? (
        <legend className="sr-only">{label}</legend>
      ) : (
        <legend className="mb-2 font-display text-sm font-bold uppercase tracking-tight text-ink">
          {label}
        </legend>
      )}
      <div className={cn("flex flex-wrap", compact ? "gap-x-1.5 gap-y-2" : "gap-x-2 gap-y-3 sm:gap-x-3")}>
        {allowAny ? (
          <TraitSticker
            id="any"
            label="Peu importe"
            selected={value === null}
            tilt={tilts[0]}
            compact={compact}
            onClick={() => onChange(null)}
          />
        ) : null}
        {traits.map((trait, index) => (
          <TraitSticker
            key={trait.id}
            id={trait.id}
            label={trait.label}
            selected={value === trait.id}
            tilt={tilts[(index + (allowAny ? 1 : 0)) % tilts.length]}
            compact={compact}
            onClick={() =>
              onChange(value === trait.id ? null : trait.id)
            }
          />
        ))}
      </div>
    </fieldset>
  );
}

export function PickedTraits({
  animal,
  ingredient,
  vibe,
  onEdit,
}: {
  animal: Trait | null;
  ingredient: Trait | null;
  vibe: Trait | null;
  onEdit: (step: "animal" | "ingredient" | "vibe") => void;
}) {
  const picks = [
    animal && { step: "animal" as const, trait: animal },
    ingredient && { step: "ingredient" as const, trait: ingredient },
    vibe && { step: "vibe" as const, trait: vibe },
  ].filter(Boolean) as { step: "animal" | "ingredient" | "vibe"; trait: Trait }[];

  if (picks.length === 0) return null;

  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      {picks.map(({ step, trait }) => (
        <button
          key={step}
          type="button"
          onClick={() => onEdit(step)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-pill border-[3px] border-ink px-2 py-1 font-display text-[0.65rem] font-bold uppercase tracking-tight shadow-sticker-sm sm:text-xs",
            traitStickerTone[trait.id] ?? "bg-white",
          )}
        >
          <span className="inline-flex h-6 w-6 items-center justify-center [&>svg]:h-5 [&>svg]:w-5">
            {icons[trait.id]}
          </span>
          {trait.label}
        </button>
      ))}
    </div>
  );
}
