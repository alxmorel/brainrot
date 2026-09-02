"use client";

import { useEffect, useId, useRef, useState } from "react";
import { teeColors, type TeeColorId } from "@/data/teeColors";
import { cn } from "@/shared/utils/cn";

export function ColorSwatches({
  colors,
  value,
  onChange,
  compact = false,
}: {
  colors: TeeColorId[];
  value: TeeColorId;
  onChange: (id: TeeColorId) => void;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <CompactColorPicker colors={colors} value={value} onChange={onChange} />
    );
  }

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
                "h-8 w-8 rounded-full border-[3px] border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hot-pink focus-visible:ring-offset-2",
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

function CompactColorPicker({
  colors,
  value,
  onChange,
}: {
  colors: TeeColorId[];
  value: TeeColorId;
  onChange: (id: TeeColorId) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const current = teeColors.find((item) => item.id === value);
  const canChange = colors.length >= 2;

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={`Couleur ${current?.label ?? ""}`}
        aria-haspopup={canChange ? "listbox" : undefined}
        aria-expanded={canChange ? open : undefined}
        aria-controls={canChange ? listId : undefined}
        title={current?.label}
        onClick={canChange ? () => setOpen((prev) => !prev) : undefined}
        className="inline-flex h-10 items-center gap-2 rounded-pill border-[3px] border-ink bg-white pl-1.5 pr-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hot-pink focus-visible:ring-offset-2"
      >
        <span
          className="h-6 w-6 shrink-0 rounded-full border-[3px] border-ink"
          style={{ backgroundColor: current?.swatch ?? "#f4f1ea" }}
        />
        <span className="font-display text-sm font-bold uppercase text-ink">
          {current?.label}
        </span>
      </button>
      {open && canChange ? (
        <ul
          id={listId}
          role="listbox"
          aria-label="Couleur"
          className="absolute left-0 z-20 mt-1 min-w-[10.5rem] rounded-xl border-[3px] border-ink bg-white p-1 shadow-sticker-sm"
        >
          {colors.map((id) => {
            const color = teeColors.find((item) => item.id === id);
            if (!color) return null;
            const selected = value === id;
            return (
              <li key={id} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(id);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left font-display text-sm font-bold uppercase text-ink hover:bg-acid-yellow focus-visible:outline-none focus-visible:bg-acid-yellow",
                    selected && "bg-ink-soft",
                  )}
                >
                  <span
                    className="h-6 w-6 shrink-0 rounded-full border-[3px] border-ink"
                    style={{ backgroundColor: color.swatch }}
                  />
                  {color.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
