"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { brand, rarityLabel } from "@/data/brand";
import { brainrots } from "@/data/brainrots";
import { sellableTeeSizes } from "@/data/fulfillment";
import {
  customProductNote,
  shippingNote,
  teePriceLabel,
} from "@/data/pricing";
import { colorsForBrainrot } from "@/data/productAssets";
import { defaultProduct } from "@/data/products";
import { type TeeSize } from "@/data/sizes";
import { defaultTeeColor, type TeeColorId } from "@/data/teeColors";
import { animals, ingredients, vibes } from "@/data/traits";
import { useCart } from "@/features/cart/CartProvider";
import { filterBrainrots } from "@/features/generator/filterBrainrots";
import { TeeMockup } from "@/features/generator/TeeMockup";
import { TraitChips, traitStickerTone, traitToneMuted, traitToneText } from "@/features/generator/TraitChips";
import { ColorSwatches } from "@/features/product/ColorSwatches";
import { SizeGuideDialog } from "@/features/product/SizeGuide";
import { teePageHref, useTeeColor, useTeeSize } from "@/features/product/teeSize";
import { SiteNav } from "@/shared/components/layout/SiteNav";
import { Badge, Button } from "@/shared/components/ui";
import { cn } from "@/shared/utils/cn";
import { track } from "@/shared/utils/track";
import type { Brainrototo, Trait } from "@/models";

const GENERATE_MS = 380;

type Category = "animal" | "ingredient" | "vibe";

const categories: { id: Category; label: string }[] = [
  { id: "animal", label: "Animal" },
  { id: "ingredient", label: "Bouffe" },
  { id: "vibe", label: "Vibe" },
];

function pickRandom(
  items: Brainrototo[],
  excludeId?: string | null,
): Brainrototo | null {
  if (items.length === 0) return null;
  const pool =
    excludeId && items.length > 1
      ? items.filter((item) => item.id !== excludeId)
      : items;
  return pool[Math.floor(Math.random() * pool.length)] ?? null;
}

function traitById(list: Trait[], id: string | null) {
  return id ? (list.find((t) => t.id === id) ?? null) : null;
}

export function GeneratorStudio({
  initialBrainrotId,
  initialSize,
  initialColor,
}: {
  initialBrainrotId?: string;
  initialSize?: TeeSize;
  initialColor?: TeeColorId;
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
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [selected, setSelected] = useState<Brainrototo | null>(initialBrainrot);
  const [size, setSize] = useTeeSize(initialSize);
  const [color, setColor] = useTeeColor(initialColor);
  const palette = selected ? colorsForBrainrot(selected) : [defaultTeeColor];
  const resolvedColor = palette.includes(color)
    ? color
    : palette[0] ?? defaultTeeColor;
  const [justAdded, setJustAdded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [revealKey, setRevealKey] = useState(0);

  const matches = useMemo(
    () => filterBrainrots(brainrots, { animal, ingredient, vibe }),
    [animal, ingredient, vibe],
  );

  const hasFilters = Boolean(animal || ingredient || vibe);

  useEffect(() => {
    if (!selected) return;
    if (matches.some((item) => item.id === selected.id)) return;
    setSelected(null);
  }, [matches, selected]);

  function pickAnimal(id: string | null) {
    setAnimal(id);
    setSelected(null);
    if (id) track("trait_select", { trait: "animal", id });
  }

  function pickIngredient(id: string | null) {
    setIngredient(id);
    setSelected(null);
    if (id) track("trait_select", { trait: "ingredient", id });
  }

  function pickVibe(id: string | null) {
    setVibe(id);
    setSelected(null);
    if (id) track("trait_select", { trait: "vibe", id });
  }

  function resetFilters() {
    setAnimal(null);
    setIngredient(null);
    setVibe(null);
    setSelected(null);
    setActiveCategory(null);
  }

  const pickedAnimal = traitById(animals, animal);
  const pickedIngredient = traitById(ingredients, ingredient);
  const pickedVibe = traitById(vibes, vibe);

  const activeTraits =
    activeCategory === "animal"
      ? animals
      : activeCategory === "ingredient"
        ? ingredients
        : activeCategory === "vibe"
          ? vibes
          : null;

  const activeValue =
    activeCategory === "animal"
      ? animal
      : activeCategory === "ingredient"
        ? ingredient
        : activeCategory === "vibe"
          ? vibe
          : null;

  const activeOnChange =
    activeCategory === "animal"
      ? pickAnimal
      : activeCategory === "ingredient"
        ? pickIngredient
        : activeCategory === "vibe"
          ? pickVibe
          : null;

  const activeLabel =
    activeCategory === "animal"
      ? "Animal"
      : activeCategory === "ingredient"
        ? "Bouffe"
        : activeCategory === "vibe"
          ? "Vibe"
          : "";

  function categoryPick(id: Category): Trait | null {
    if (id === "animal") return pickedAnimal;
    if (id === "ingredient") return pickedIngredient;
    return pickedVibe;
  }

  function toggleCategory(id: Category) {
    setActiveCategory((current) => (current === id ? null : id));
  }

  function reveal(brainrot: Brainrototo) {
    setSelected(brainrot);
    setRevealKey((key) => key + 1);
    track("brainrot_select", { brainrotId: brainrot.id });
    track("preview_open", {
      brainrotId: brainrot.id,
      productId: defaultProduct.id,
    });
  }

  function handleGenerate() {
    if (isGenerating || matches.length === 0) return;
    setIsGenerating(true);
    window.setTimeout(() => {
      const next = pickRandom(matches, selected?.id);
      if (next) reveal(next);
      setIsGenerating(false);
    }, GENERATE_MS);
  }

  function pickSize(value: TeeSize) {
    setSize(value);
    if (selected) {
      track("size_change", { size: value, brainrotId: selected.id });
    }
  }

  function pickColor(value: TeeColorId) {
    setColor(value);
    if (selected) {
      track("color_change", { color: value, brainrotId: selected.id });
    }
  }

  function handleAdd() {
    if (!selected) return;
    addItem(selected.id, defaultProduct.id, size, resolvedColor);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1600);
  }

  const canGenerate = matches.length > 0 && !isGenerating;

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <SiteNav />

      <main className="mx-auto grid min-h-0 w-full max-w-[1200px] flex-1 grid-rows-[auto_minmax(0,1fr)] gap-3 px-3 pt-2 pb-4 sm:gap-4 sm:px-6 sm:pt-3 sm:pb-5 lg:grid-cols-[24rem_minmax(0,1fr)] lg:grid-rows-1 lg:items-stretch lg:gap-6 lg:px-8 lg:pb-6 xl:max-w-[1280px] xl:grid-cols-[26rem_minmax(0,1fr)] xl:gap-8">
        <section className="flex min-h-0 flex-col gap-2 lg:gap-3">
          <div className="shrink-0">
            <h1 className="font-display text-[clamp(1.35rem,3.5vw,2.4rem)] font-bold uppercase leading-[0.9] tracking-[-0.04em] text-ink">
              {brand.collection.title}
            </h1>
            <p className="mt-1 text-xs font-bold text-ink/65 sm:text-sm lg:text-base">
              {brand.collection.lead}
            </p>
          </div>

          <div className="flex flex-col rounded-2xl border-[3px] border-ink bg-white p-3 shadow-sticker sm:p-4 lg:p-4">
            <p className="shrink-0 font-display text-sm font-bold uppercase tracking-tight text-ink lg:text-base">
              {brand.collection.filters}
            </p>

            <div className="mt-3 flex shrink-0 gap-2 lg:gap-2.5">
              {categories.map((category) => {
                const picked = categoryPick(category.id);
                const open = activeCategory === category.id;
                const tone = picked
                  ? traitStickerTone[picked.id] ?? "bg-acid-yellow"
                  : null;
                return (
                  <button
                    key={category.id}
                    type="button"
                    aria-pressed={open}
                    onClick={() => toggleCategory(category.id)}
                    className={cn(
                      "flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl border-[3px] border-ink px-1.5 py-2 font-display text-[0.65rem] font-bold uppercase leading-tight shadow-sticker-sm transition-[transform,background-color,box-shadow,color] duration-[var(--duration-button)] sm:text-xs lg:gap-1 lg:px-2 lg:py-2.5 lg:text-sm",
                      open && "scale-[1.03] shadow-sticker",
                      tone
                        ? cn(tone, traitToneText(picked!.id))
                        : open
                          ? "bg-acid-yellow text-ink"
                          : "bg-white text-ink hover:bg-ink-soft",
                    )}
                  >
                    <span>{category.label}</span>
                    {picked ? (
                      <span
                        className={cn(
                          "truncate max-w-full text-[0.55rem] normal-case tracking-tight lg:text-xs",
                          traitToneMuted(picked.id),
                        )}
                      >
                        {picked.label}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div className="mt-3">
              {activeTraits && activeOnChange ? (
                <TraitChips
                  label={activeLabel}
                  traits={activeTraits}
                  value={activeValue}
                  onChange={activeOnChange}
                  compact
                  hideLabel
                />
              ) : (
                <p className="rounded-xl border-[3px] border-dashed border-ink/25 bg-ink-soft px-3 py-3 text-center text-xs font-bold text-ink/50 lg:text-sm">
                  Choisis Animal, Bouffe ou Vibe
                </p>
              )}
            </div>

            <div className="mt-3 flex shrink-0 flex-col gap-2">
              {matches.length === 0 ? (
                <p className="text-center text-xs font-bold text-ink/55 lg:text-sm">
                  {brand.collection.emptyCombo}
                </p>
              ) : null}
              <Button
                className="w-full lg:text-base"
                size="lg"
                disabled={!canGenerate}
                onClick={handleGenerate}
              >
                {isGenerating
                  ? brand.collection.generating
                  : selected
                    ? brand.collection.generateAgain
                    : brand.collection.generate}
              </Button>
              {hasFilters ? (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="self-start text-xs font-bold uppercase text-hot-pink underline decoration-2 underline-offset-2 lg:text-sm"
                >
                  Réinitialiser
                </button>
              ) : null}
            </div>
          </div>
        </section>

        <section className="flex min-h-0 flex-col items-center">
          <div className="flex min-h-0 w-full max-w-[min(100%,26rem)] flex-1 flex-col xl:max-w-[30rem]">
            <div
              key={revealKey}
              className={cn(
                "flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden",
                selected && "animate-tee-reveal",
              )}
            >
              <TeeMockup
                product={defaultProduct}
                brainrot={selected}
                color={resolvedColor}
                className="h-full max-h-full w-full max-w-full"
                emptyLabel={brand.collection.pick}
              />
            </div>

            <div className="mt-2 w-full shrink-0 text-center sm:mt-3">
              <p className="font-display text-xs font-bold uppercase tracking-tight text-ink/70 sm:text-sm lg:text-base">
                {defaultProduct.name} · {teePriceLabel}
              </p>
              <h2 className="mt-1 font-display text-xl font-bold uppercase leading-none text-ink sm:text-2xl lg:text-3xl">
                {selected && !isGenerating
                  ? selected.name
                  : brand.collection.pick}
              </h2>
              {selected?.rarity && !isGenerating ? (
                <div className="mt-2 flex justify-center">
                  <Badge rarity={selected.rarity} className="px-3 py-1 text-xs lg:text-sm">
                    {rarityLabel[selected.rarity]}
                  </Badge>
                </div>
              ) : null}
            </div>

            {selected ? (
              <div className="mt-3 mb-1 w-full shrink-0 rounded-2xl border-[3px] border-ink bg-white p-3 shadow-sticker-sm sm:p-4 lg:mt-4">
                <ColorSwatches
                  colors={palette}
                  value={resolvedColor}
                  onChange={pickColor}
                />
                <div className="mt-3 flex items-baseline justify-between gap-3">
                  <p className="font-display text-sm font-bold uppercase text-ink lg:text-base">
                    Taille
                  </p>
                  <SizeGuideDialog />
                </div>
                <div className="mt-2 flex flex-wrap justify-center gap-2">
                  {sellableTeeSizes().map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => pickSize(value)}
                      className={
                        size === value
                          ? "min-w-[2.75rem] rounded-pill border-[3px] border-ink bg-acid-yellow px-3 py-2 font-display text-sm font-bold uppercase shadow-sticker-sm lg:min-w-[3.25rem] lg:px-3.5 lg:text-base"
                          : "min-w-[2.75rem] rounded-pill border-[3px] border-ink bg-white px-3 py-2 font-display text-sm font-bold uppercase text-ink/70 lg:min-w-[3.25rem] lg:px-3.5 lg:text-base"
                      }
                    >
                      {value}
                    </button>
                  ))}
                </div>
                <Button
                  className="mt-4 w-full lg:text-base"
                  size="lg"
                  disabled={!selected || isGenerating}
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
                <div className="mt-2 flex items-center justify-center gap-3">
                  <Link
                    href={teePageHref(selected.id, size, resolvedColor)}
                    className="font-display text-xs font-bold uppercase tracking-tight text-ink/55 underline decoration-2 underline-offset-2 hover:text-hot-pink lg:text-sm"
                  >
                    Détails
                  </Link>
                  <p className="text-xs font-bold leading-snug text-ink/45 lg:text-sm">
                    {shippingNote}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-3 shrink-0 text-center text-xs font-bold text-ink/40 lg:text-sm">
                {shippingNote}. {customProductNote}
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
