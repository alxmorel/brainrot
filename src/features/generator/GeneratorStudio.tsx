"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { brainrots } from "@/data/brainrots";
import { sellableTeeSizes } from "@/data/fulfillment";
import {
  customProductNote,
  shippingNote,
  teePriceLabel,
} from "@/data/pricing";
import { defaultProduct } from "@/data/products";
import { type TeeSize } from "@/data/sizes";
import { animals, ingredients, vibes } from "@/data/traits";
import { useCart } from "@/features/cart/CartProvider";
import { BrainrotGrid } from "@/features/generator/BrainrotGrid";
import { filterBrainrots } from "@/features/generator/filterBrainrots";
import { TeeMockup } from "@/features/generator/TeeMockup";
import { TraitChips } from "@/features/generator/TraitChips";
import { SizeGuideDialog } from "@/features/product/SizeGuide";
import { teePageHref, useTeeSize } from "@/features/product/teeSize";
import { SiteFooter } from "@/shared/components/layout/SiteFooter";
import { SiteNav } from "@/shared/components/layout/SiteNav";
import { Button } from "@/shared/components/ui";
import { track } from "@/shared/utils/track";
import type { Brainrototo } from "@/models";

export function GeneratorStudio({
  initialBrainrotId,
  initialSize,
}: {
  initialBrainrotId?: string;
  initialSize?: TeeSize;
}) {
  const { addItem } = useCart();
  const initialBrainrot =
    brainrots.find((item) => item.id === initialBrainrotId) ?? null;
  const [animal, setAnimal] = useState<string | null>(
    initialBrainrot?.animal ?? null,
  );
  const [ingredient, setIngredient] = useState<string | null>(
    initialBrainrot?.ingredient ?? null,
  );
  const [vibe, setVibe] = useState<string | null>(initialBrainrot?.vibe ?? null);
  const [selected, setSelected] = useState<Brainrototo | null>(initialBrainrot);
  const [size, setSize] = useTeeSize(initialSize);
  const [justAdded, setJustAdded] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(Boolean(initialBrainrot));

  const matches = useMemo(
    () => filterBrainrots(brainrots, { animal, ingredient, vibe }),
    [animal, ingredient, vibe],
  );

  useEffect(() => {
    if (selected && matches.some((item) => item.id === selected.id)) return;
    setSelected(null);
  }, [matches, selected]);

  function pickAnimal(id: string | null) {
    setAnimal(id);
    if (id) track("trait_select", { trait: "animal", id });
  }

  function pickIngredient(id: string | null) {
    setIngredient(id);
    if (id) track("trait_select", { trait: "ingredient", id });
  }

  function pickVibe(id: string | null) {
    setVibe(id);
    track("trait_select", { trait: "vibe", id: id ?? "any" });
  }

  function resetFilters() {
    setAnimal(null);
    setIngredient(null);
    setVibe(null);
  }

  function handleAdd() {
    if (!selected) return;
    addItem(selected.id, defaultProduct.id, size);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1600);
  }

  const hasFilters = Boolean(animal || ingredient || vibe);

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteNav />

      <main className="mx-auto grid max-w-[1500px] gap-6 px-4 pb-36 pt-2 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-8 lg:px-8 lg:pb-12 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <section>
          <h1 className="font-display text-[clamp(1.8rem,5vw,3.4rem)] font-bold uppercase leading-[0.9] tracking-[-0.04em] text-ink">
            La collection
          </h1>
          <p className="mt-2 max-w-xl text-sm font-bold text-ink/70 sm:text-base">
            Filtre un combo, choisis l’illu, on l’imprime sur le tee.
          </p>

          <details
            className="mt-5 rounded-2xl border-[3px] border-ink bg-white p-4 shadow-sticker-sm open:shadow-sticker"
            open={filtersOpen}
            onToggle={(event) => setFiltersOpen(event.currentTarget.open)}
          >
            <summary className="cursor-pointer list-none font-display text-sm font-bold uppercase tracking-tight text-ink [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-2">
                Filtres
                {hasFilters ? (
                  <span className="text-xs text-hot-pink">actifs</span>
                ) : (
                  <span className="text-xs text-ink/45">optionnel</span>
                )}
              </span>
            </summary>
            <div className="mt-4 flex flex-col gap-3">
              <TraitChips
                label="Animal"
                traits={animals}
                value={animal}
                onChange={pickAnimal}
                allowAny
              />
              <TraitChips
                label="Ingrédient"
                traits={ingredients}
                value={ingredient}
                onChange={pickIngredient}
                allowAny
              />
              <TraitChips
                label="Vibe"
                traits={vibes}
                value={vibe}
                onChange={pickVibe}
                allowAny
              />
              {hasFilters ? (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="self-start text-sm font-bold uppercase text-hot-pink underline decoration-2 underline-offset-2"
                >
                  Réinitialiser
                </button>
              ) : null}
            </div>
          </details>

          <div className="mt-6 flex items-baseline justify-between gap-3">
            <p className="font-display text-sm font-bold uppercase text-ink">
              {matches.length} Brainrototo{matches.length > 1 ? "s" : ""}
            </p>
          </div>

          {matches.length === 0 ? (
            <div className="mt-4 rounded-2xl border-[3px] border-ink bg-white px-4 py-8 text-center shadow-sticker-sm">
              <p className="font-display text-lg font-bold uppercase text-ink">
                Aucun Brainrototo pour ce combo
              </p>
              <p className="mt-1 text-sm font-bold text-ink/60">
                Change un trait ou réinitialise les filtres.
              </p>
              <Button className="mt-4" variant="secondary" onClick={resetFilters}>
                Voir tout
              </Button>
            </div>
          ) : (
            <div className="mt-4">
              <BrainrotGrid
                items={matches}
                selectedId={selected?.id ?? null}
                onSelect={setSelected}
              />
            </div>
          )}
        </section>

        <aside className="fixed inset-x-3 bottom-3 z-30 lg:sticky lg:top-4 lg:inset-auto lg:bottom-auto">
          <div className="rounded-2xl border-[3px] border-ink bg-white p-3 shadow-sticker sm:p-5">
            <div className="flex items-center gap-3 lg:block">
              {selected ? (
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border-[3px] border-ink bg-acid-yellow lg:hidden">
                  <Image
                    src={selected.image}
                    alt=""
                    fill
                    className="object-contain p-1"
                  />
                </div>
              ) : null}
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-bold uppercase tracking-tight text-ink/70">
                  {defaultProduct.name} · {teePriceLabel}
                </p>
                <h2 className="mt-1 font-display text-xl font-bold uppercase leading-none text-ink sm:text-2xl">
                  {selected?.name ?? "Choisis un Brainrototo"}
                </h2>
              </div>
            </div>
            <div className="hidden lg:block">
              <TeeMockup product={defaultProduct} brainrot={selected} />
            </div>
            <div className="mt-3 flex items-baseline justify-between gap-3">
              <p className="font-display text-sm font-bold uppercase text-ink">
                Taille
              </p>
              <SizeGuideDialog />
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {sellableTeeSizes().map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSize(value)}
                  className={
                    size === value
                      ? "rounded-pill border-[3px] border-ink bg-acid-yellow px-2.5 py-1 font-display text-xs font-bold uppercase shadow-sticker-sm"
                      : "rounded-pill border-[3px] border-ink bg-white px-2.5 py-1 font-display text-xs font-bold uppercase text-ink/70"
                  }
                >
                  {value}
                </button>
              ))}
            </div>
            <Button
              className="mt-3 w-full"
              disabled={!selected}
              onClick={handleAdd}
            >
              {justAdded ? "Ajouté ✓" : "Ajouter au panier"}
            </Button>
            {justAdded ? (
              <Link
                href="/cart"
                className="mt-2 inline-flex w-full justify-center font-display text-sm font-bold uppercase text-hot-pink underline decoration-2 underline-offset-2"
              >
                Voir le panier →
              </Link>
            ) : null}
            {selected ? (
              <Link
                href={teePageHref(selected.id, size)}
                className="mt-2 inline-flex w-full justify-center font-display text-xs font-bold uppercase tracking-tight text-ink/55 underline decoration-2 underline-offset-2 hover:text-hot-pink"
              >
                Détails du tee
              </Link>
            ) : null}
            <p className="mt-2 text-[0.65rem] font-bold leading-snug text-ink/45">
              {shippingNote}. {customProductNote}
            </p>
          </div>
        </aside>
      </main>
      <SiteFooter />
    </div>
  );
}
