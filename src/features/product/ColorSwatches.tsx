"use client";

import { teeColors, type TeeColorId } from "@/data/teeColors";
import { cn } from "@/shared/utils/cn";

export function ColorSwatches({
  colors,
  value,
  onChange,
}: {
  colors: TeeColorId[];
  value: TeeColorId;
  onChange: (id: TeeColorId) => void;
}) {
  if (colors.length < 2) return null;

  return (
    <div>
      <p className="font-display text-sm font-bold uppercase text-ink">
        Couleur
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {colors.map((id) => {
          const color = teeColors.find((item) => item.id === id);
          if (!color) return null;
          const selected = value === id;
          return (
            <button
              key={id}
              type="button"
              aria-label={color.label}
              aria-pressed={selected}
              title={color.label}
              onClick={() => onChange(id)}
              className={cn(
                "h-8 w-8 rounded-full border-[3px] border-ink",
                selected ? "shadow-sticker-sm scale-110" : "opacity-80",
              )}
              style={{ backgroundColor: color.swatch }}
            />
          );
        })}
      </div>
    </div>
  );
}
