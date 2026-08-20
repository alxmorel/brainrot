"use client";

import { useEffect, useMemo, useState } from "react";
import { brainrots } from "@/data/brainrots";
import { defaultProduct } from "@/data/products";
import { teeSizes, type TeeSize } from "@/data/sizes";
import { animals, ingredients, vibes } from "@/data/traits";
import { useCart } from "@/features/cart/CartProvider";
import { BrainrotGrid } from "@/features/generator/BrainrotGrid";
import { filterBrainrots } from "@/features/generator/filterBrainrots";
import { TeeMockup } from "@/features/generator/TeeMockup";
import { PickedTraits, TraitChips } from "@/features/generator/TraitChips";
import { SiteFooter } from "@/shared/components/layout/SiteFooter";
import { SiteNav } from "@/shared/components/layout/SiteNav";
import { Button } from "@/shared/components/ui";
import { track } from "@/shared/utils/track";
import type { Brainrototo } from "@/models";

type Step = "animal" | "ingredient" | "vibe";

export function GeneratorStudio() {
  const { addItem } = useCart();
  const [animal, setAnimal] = useState<string | null>(null);
  const [ingredient, setIngredient] = useState<string | null>(null);
  const [vibe, setVibe] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("animal");
  const [selected, setSelected] = useState<Brainrototo | null>(null);
  const [justAdded, setJustAdded] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [size, setSize] = useState<TeeSize>("M");

  const matches = useMemo(
    () => filterBrainrots(brainrots, { animal, ingredient, vibe }),
    [animal, ingredient, vibe],
  );

  useEffect(() => {
    if (selected && matches.some((item) => item.id === selected.id)) return;
    setSelected(matches[0] ?? null);
  }, [matches, selected]);

  useEffect(() => {
    if (!previewOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPreviewOpen(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [previewOpen]);

  const pickedAnimal = animals.find((item) => item.id === animal) ?? null;
  const pickedIngredient =
    ingredients.find((item) => item.id === ingredient) ?? null;
  const pickedVibe = vibes.find((item) => item.id === vibe) ?? null;

  function pickAnimal(id: string | null) {
    if (id && id === animal) {
      setStep("ingredient");
      return;
    }
    setAnimal(id);
    setIngredient(null);
    setVibe(null);
    setStep(id ? "ingredient" : "animal");
    if (id) track("trait_select", { trait: "animal", id });
  }

  function pickIngredient(id: string | null) {
    if (id && id === ingredient) {
      setStep("vibe");
      return;
    }
    setIngredient(id);
    setVibe(null);
    setStep(id ? "vibe" : "ingredient");
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
    setStep("animal");
  }

  function handleAdd() {
    if (!selected) return;
    addItem(selected.id, defaultProduct.id, size);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1600);
  }

  const hasFilters = Boolean(animal || ingredient || vibe);
  const stepCopy =
    step === "animal"
      ? "Pick un animal."
      : step === "ingredient"
        ? "Maintenant un ingrédient."
        : "Une vibe — ou skip.";

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteNav />

      <main className="mx-auto grid max-w-[1500px] gap-6 px-4 pb-28 pt-2 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-8 lg:px-8 lg:pb-12 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <section>
          <h1 className="font-display text-[clamp(1.8rem,5vw,3.4rem)] font-bold uppercase leading-[0.9] tracking-[-0.04em] text-ink">
            Crée ton Brainrototo
          </h1>
          <p className="mt-2 max-w-xl text-sm font-bold text-ink/70 sm:text-base">
            {stepCopy}
          </p>

          <div className="mt-5 flex flex-col gap-3">
            <PickedTraits
              animal={pickedAnimal}
              ingredient={pickedIngredient}
              vibe={pickedVibe}
              onEdit={setStep}
            />
            {step === "animal" ? (
              <TraitChips
                label="Animal"
                traits={animals}
                value={animal}
                onChange={pickAnimal}
              />
            ) : null}
            {step === "ingredient" ? (
              <TraitChips
                label="Ingrédient"
                traits={ingredients}
                value={ingredient}
                onChange={pickIngredient}
              />
            ) : null}
            {step === "vibe" ? (
              <TraitChips
                label="Vibe"
                traits={vibes}
                value={vibe}
                onChange={pickVibe}
                allowAny
              />
            ) : null}
          </div>

          <div className="mt-6 flex items-baseline justify-between gap-3">
            <p className="font-display text-sm font-bold uppercase text-ink">
              {matches.length} Brainrototo{matches.length > 1 ? "s" : ""}
            </p>
            {hasFilters ? (
              <button
                type="button"
                onClick={resetFilters}
                className="text-sm font-bold uppercase text-hot-pink underline decoration-2 underline-offset-2"
              >
                Reset
              </button>
            ) : null}
          </div>

          {matches.length === 0 ? (
            <div className="mt-4 rounded-2xl border-[3px] border-ink bg-white px-4 py-8 text-center shadow-sticker-sm">
              <p className="font-display text-lg font-bold uppercase text-ink">
                Aucun Brainrototo pour ce combo
              </p>
              <p className="mt-1 text-sm font-bold text-ink/60">
                Change un trait ou reset les filtres.
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
            <p className="font-display text-sm font-bold uppercase tracking-tight text-ink/70">
              {defaultProduct.name}
            </p>
            <h2 className="mt-1 font-display text-xl font-bold uppercase leading-none text-ink sm:text-2xl">
              {selected?.name ?? "Pick un Brainrototo"}
            </h2>
            <div className="hidden lg:block">
              <TeeMockup product={defaultProduct} brainrot={selected} />
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {teeSizes.map((value) => (
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
            <div className="mt-3 flex gap-2">
              <Button
                className="flex-1"
                variant="ghost"
                onClick={() => {
                  track("preview_open");
                  setPreviewOpen(true);
                }}
              >
                Preview
              </Button>
              <Button
                className="flex-[1.4]"
                disabled={!selected}
                onClick={handleAdd}
              >
                {justAdded ? "Ajouté ✓" : "Ajouter au panier"}
              </Button>
            </div>
          </div>
        </aside>
      </main>

      {previewOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Preview t-shirt"
          className="fixed inset-0 z-50 flex flex-col bg-[#f3f1ec]"
        >
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <p className="min-w-0 truncate font-display text-lg font-bold uppercase leading-none text-ink">
              {selected?.name ?? "Preview"}
            </p>
            <Button variant="ghost" size="sm" onClick={() => setPreviewOpen(false)}>
              Fermer
            </Button>
          </div>
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-auto px-4 pb-8">
            <TeeMockup
              product={defaultProduct}
              brainrot={selected}
              className="max-w-[min(100%,28rem)]"
            />
            <div className="mt-4 flex flex-wrap justify-center gap-1.5">
              {teeSizes.map((value) => (
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
              className="mt-6"
              disabled={!selected}
              onClick={() => {
                handleAdd();
                setPreviewOpen(false);
              }}
            >
              Ajouter au panier
            </Button>
          </div>
        </div>
      ) : null}
      <SiteFooter />
    </div>
  );
}
