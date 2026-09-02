"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/shared/utils/cn";

export function SizePicker({
  sizes,
  value,
  onChange,
  name,
}: {
  sizes: string[];
  value: string;
  onChange: (size: string) => void;
  name?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const options = sizes.includes(value) ? sizes : [value, ...sizes];

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
        aria-label={name ? `Taille de ${name}` : "Taille"}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        title={`Taille ${value}`}
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex h-10 min-w-10 items-center justify-center rounded-full border-[3px] border-ink bg-white px-2 font-display text-sm font-bold uppercase text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hot-pink focus-visible:ring-offset-2"
      >
        {value}
      </button>
      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label="Taille"
          className="absolute left-0 z-20 mt-1 min-w-[6.5rem] rounded-xl border-[3px] border-ink bg-white p-1 shadow-sticker-sm"
        >
          {options.map((size) => {
            const selected = value === size;
            return (
              <li key={size} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(size);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center rounded-lg px-3 py-1.5 text-left font-display text-sm font-bold uppercase text-ink hover:bg-acid-yellow focus-visible:outline-none focus-visible:bg-acid-yellow",
                    selected && "bg-ink-soft",
                  )}
                >
                  {size}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
