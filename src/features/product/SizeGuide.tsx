"use client";

import { useEffect, useState } from "react";
import { sellableTeeSizes } from "@/data/fulfillment";
import { sizeGuideMeta, sizeGuideRows } from "@/data/sizeGuide";
import { Button } from "@/shared/components/ui";

export function SizeGuideTable() {
  const sizes = sellableTeeSizes();

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[20rem] border-collapse text-left text-sm">
        <caption className="mb-3 text-left font-display text-base font-bold uppercase text-ink">
          {sizeGuideMeta.title} - {sizeGuideMeta.fit}
        </caption>
        <thead>
          <tr className="border-b-[3px] border-ink">
            <th className="py-2 pr-3 font-display text-xs font-bold uppercase tracking-tight">
              Taille
            </th>
            <th className="py-2 pr-3 font-display text-xs font-bold uppercase tracking-tight">
              Longueur
            </th>
            <th className="py-2 pr-3 font-display text-xs font-bold uppercase tracking-tight">
              1/2 poitrine
            </th>
            <th className="py-2 font-display text-xs font-bold uppercase tracking-tight">
              Tour de poitrine
            </th>
          </tr>
        </thead>
        <tbody>
          {sizes.map((size) => {
            const row = sizeGuideRows[size];
            return (
              <tr key={size} className="border-b border-ink/15">
                <td className="py-2 pr-3 font-display font-bold">{size}</td>
                <td className="py-2 pr-3 font-bold text-ink/80">
                  {row.length} {sizeGuideMeta.unit}
                </td>
                <td className="py-2 pr-3 font-bold text-ink/80">
                  {row.halfChest} {sizeGuideMeta.unit}
                </td>
                <td className="py-2 font-bold text-ink/80">
                  {row.halfChest * 2} {sizeGuideMeta.unit}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="mt-3 text-xs font-bold text-ink/55">
        Tolérance {sizeGuideMeta.tolerance}. {sizeGuideMeta.hint}
      </p>
    </div>
  );
}

export function SizeGuideDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="font-display text-sm font-bold uppercase tracking-tight text-hot-pink underline decoration-2 underline-offset-2"
      >
        Guide des tailles
      </button>
      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="size-guide-title"
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-3 sm:items-center"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-[90dvh] w-full max-w-lg overflow-auto rounded-2xl border-[3px] border-ink bg-white p-5 shadow-sticker sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <h2
                id="size-guide-title"
                className="font-display text-xl font-bold uppercase leading-none text-ink"
              >
                Guide des tailles
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
                Fermer
              </Button>
            </div>
            <div className="mt-5">
              <SizeGuideTable />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
