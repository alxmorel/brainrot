"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { brand } from "@/data/brand";
import { brainrots } from "@/data/brainrots";
import { sellableTeeSizes } from "@/data/fulfillment";
import { customProductNote, shippingNote } from "@/data/pricing";
import { colorsForBrainrot } from "@/data/productAssets";
import { defaultProduct } from "@/data/products";
import { type TeeSize } from "@/data/sizes";
import { defaultTeeColor, type TeeColorId } from "@/data/teeColors";
import { animals, ingredients, vibes } from "@/data/traits";
import { useCart } from "@/features/cart/CartProvider";
import { flyToCart } from "@/features/cart/flyToCart";
import { filterBrainrots } from "@/features/generator/filterBrainrots";
import { PackRevealOverlay } from "@/features/generator/PackRevealOverlay";
import { TeeMockup } from "@/features/generator/TeeMockup";
import { TraitChips, traitStickerTone, traitToneMuted, traitToneText } from "@/features/generator/TraitChips";
import { ColorSwatches } from "@/features/product/ColorSwatches";
import { SizeGuideDialog } from "@/features/product/SizeGuide";
import { teePageHref, useTeeColor, useTeeSize } from "@/features/product/teeSize";
import { Button, PriceTag } from "@/shared/components/ui";
import { cn } from "@/shared/utils/cn";
import { track } from "@/shared/utils/track";
import type { Brainrototo, Trait } from "@/models";

const PACK_MS = 1000;
const PACK_REVEAL_AT = 480;
const COMBO_KEY = "brainrot-combo-v1";
const easeOut = [0.22, 1, 0.36, 1] as const;
const spring = [0.34, 1.4, 0.64, 1] as const;

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

function validTraitId(list: Trait[], value: unknown): string | null {
  if (typeof value !== "string") return null;
  return list.some((trait) => trait.id === value) ? value : null;
}

type StoredCombo = {
  animal: string | null;
  ingredient: string | null;
  vibe: string | null;
  brainrotId: string | null;
};

function readStoredCombo(): StoredCombo | null {
  try {
    const raw = localStorage.getItem(COMBO_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const row = parsed as Record<string, unknown>;
    const animal = validTraitId(animals, row.animal);
    const ingredient = validTraitId(ingredients, row.ingredient);
    const vibe = validTraitId(vibes, row.vibe);
    const brainrotId =
      typeof row.brainrotId === "string" &&
      brainrots.some((item) => item.id === row.brainrotId)
        ? row.brainrotId
        : null;
    if (!animal && !ingredient && !vibe && !brainrotId) return null;
    return { animal, ingredient, vibe, brainrotId };
  } catch {
    return null;
  }
}

function writeStoredCombo(combo: StoredCombo) {
  try {
    localStorage.setItem(COMBO_KEY, JSON.stringify(combo));
  } catch {
    /* ignore */
  }
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
  const reduced = useReducedMotion();
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
  const [hydrated, setHydrated] = useState(false);
  const [packBrainrot, setPackBrainrot] = useState<Brainrototo | null>(null);
  const packTimers = useRef<number[]>([]);

  const matches = useMemo(
    () => filterBrainrots(brainrots, { animal, ingredient, vibe }),
    [animal, ingredient, vibe],
  );

  const hasFilters = Boolean(animal || ingredient || vibe);

  useEffect(() => {
    if (!initialBrainrot) {
      const stored = readStoredCombo();
      if (stored) {
        setAnimal(stored.animal);
        setIngredient(stored.ingredient);
        setVibe(stored.vibe);
        const found = stored.brainrotId
          ? (brainrots.find((item) => item.id === stored.brainrotId) ?? null)
          : null;
        if (found) setSelected(found);
      }
    }
    setHydrated(true);
  }, [initialBrainrot]);

  useEffect(() => {
    return () => {
      packTimers.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeStoredCombo({
      animal,
      ingredient,
      vibe,
      brainrotId: selected?.id ?? null,
    });
  }, [animal, ingredient, vibe, selected, hydrated]);

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
    if (id) track("trait_select", { trait: "vibe", id });
  }

  function resetFilters() {
    setAnimal(null);
    setIngredient(null);
    setVibe(null);
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

  function clearPackTimers() {
    packTimers.current.forEach((id) => window.clearTimeout(id));
    packTimers.current = [];
  }

  function handleGenerate() {
    if (isGenerating || matches.length === 0) return;
    const next = pickRandom(matches, selected?.id);
    if (!next) return;

    if (reduced) {
      reveal(next);
      return;
    }

    clearPackTimers();
    setIsGenerating(true);
    setPackBrainrot(next);
    packTimers.current = [
      window.setTimeout(() => reveal(next), PACK_REVEAL_AT),
      window.setTimeout(() => {
        setIsGenerating(false);
        setPackBrainrot(null);
      }, PACK_MS),
    ];
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

  function handleAdd(event: { currentTarget: EventTarget }) {
    if (!selected) return;
    addItem(selected.id, defaultProduct.id, size, resolvedColor);
    flyToCart(event.currentTarget);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1600);
  }

  const canGenerate = matches.length > 0 && !isGenerating;

  const fadeUp = {
    hidden: { opacity: 0, y: reduced ? 0 : 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0.01 : 0.38, ease: easeOut },
    },
  };

  return (
    <section
      id="compose"
      data-cart-source
      className="scroll-mt-[4.75rem] px-3 py-6 sm:px-6 sm:py-8 lg:flex lg:h-[calc(100dvh-4.75rem)] lg:flex-col lg:px-10 lg:py-4 xl:px-12"
    >
      <div className="mx-auto flex w-full max-w-[1760px] flex-col lg:min-h-0 lg:flex-1">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="shrink-0"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: reduced ? 0 : 0.08,
                delayChildren: reduced ? 0 : 0.04,
              },
            },
          }}
        >
          <motion.p
            variants={fadeUp}
            className="shrink-0 text-[0.65rem] font-bold uppercase tracking-wide text-hot-pink sm:text-xs lg:text-sm"
          >
            {brand.collection.filters}
          </motion.p>
          <motion.h2
            variants={{
              hidden: {
                opacity: 0,
                y: reduced ? 0 : 28,
                scale: reduced ? 1 : 0.92,
              },
              show: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { duration: reduced ? 0.01 : 0.42, ease: spring },
              },
            }}
            className="mt-0.5 origin-left shrink-0 font-display text-[clamp(1.45rem,4vw,3.75rem)] font-bold uppercase leading-none tracking-[-0.04em] text-ink"
          >
            {brand.collection.title}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-2 max-w-xl shrink-0 font-sans text-sm font-bold leading-snug text-ink/75 sm:text-base lg:mt-3 lg:max-w-2xl lg:text-lg xl:text-xl"
          >
            {brand.collection.lead}
          </motion.p>
        </motion.div>

        <div className="mt-4 grid gap-4 sm:mt-5 lg:min-h-0 lg:flex-1 lg:grid-cols-[minmax(0,32rem)_minmax(0,1fr)] lg:items-stretch lg:gap-8 xl:grid-cols-[minmax(0,34rem)_minmax(0,1fr)] xl:gap-10">
          <motion.div
            initial={
              reduced ? false : { opacity: 0, y: 28, rotate: -3, scale: 0.96 }
            }
            whileInView={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              delay: reduced ? 0 : 0.18,
              duration: reduced ? 0.01 : 0.42,
              ease: spring,
            }}
            className="flex h-fit flex-col self-start rounded-2xl border-[3px] border-ink bg-white p-3 shadow-sticker sm:p-4 lg:rounded-[1.35rem] lg:p-5"
          >
            <div className="flex gap-2 lg:gap-3">
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
                      "flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl border-[3px] border-ink px-2 py-2 font-display text-[0.65rem] font-bold uppercase leading-tight shadow-sticker-sm transition-[transform,background-color,box-shadow,color] duration-[var(--duration-button)] sm:text-sm lg:gap-1 lg:rounded-2xl lg:px-3 lg:py-2.5 lg:text-base xl:text-lg",
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
                          "truncate max-w-full text-[0.55rem] normal-case tracking-tight sm:text-xs lg:text-sm",
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

            <div className="mt-4">
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
                <p className="rounded-xl border-[3px] border-dashed border-ink/25 bg-ink-soft px-4 py-4 text-center text-xs font-bold text-ink/55 sm:text-sm lg:text-base">
                  Choisis Animal, Bouffe ou Vibe
                </p>
              )}
            </div>

            {matches.length === 0 ? (
              <p className="mt-3 text-center text-xs font-bold text-ink/55 sm:text-sm lg:text-base">
                {brand.collection.emptyCombo}
              </p>
            ) : null}

            {selected ? (
              <>
                <div className="mt-4">
                  <ColorSwatches
                    colors={palette}
                    value={resolvedColor}
                    onChange={pickColor}
                  />
                </div>
                <div className="mt-3 flex items-baseline justify-between gap-3">
                  <p className="font-display text-xs font-bold uppercase text-ink sm:text-sm lg:text-base">
                    Taille
                  </p>
                  <SizeGuideDialog />
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {sellableTeeSizes().map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => pickSize(value)}
                      className={
                        size === value
                          ? "min-w-[2.25rem] rounded-pill border-[3px] border-ink bg-acid-yellow px-2 py-1 font-display text-xs font-bold uppercase shadow-sticker-sm sm:min-w-[2.5rem] sm:px-2.5 sm:py-1.5 sm:text-sm lg:text-base"
                          : "min-w-[2.25rem] rounded-pill border-[3px] border-ink bg-white px-2 py-1 font-display text-xs font-bold uppercase text-ink/70 sm:min-w-[2.5rem] sm:px-2.5 sm:py-1.5 sm:text-sm lg:text-base"
                      }
                    >
                      {value}
                    </button>
                  ))}
                </div>
                <div className="mt-4 flex items-stretch gap-2 lg:mt-5 lg:gap-3">
                  <Button
                    className="shrink-0 px-4 lg:px-5"
                    size="lg"
                    variant="secondary"
                    disabled={!canGenerate}
                    aria-label={brand.collection.generateAgain}
                    onClick={handleGenerate}
                  >
                    <svg
                      viewBox="0 0 32 32"
                      className="h-7 w-7 lg:h-8 lg:w-8"
                      aria-hidden
                    >
                      <rect
                        x="4"
                        y="4"
                        width="24"
                        height="24"
                        rx="6"
                        fill="#fff"
                        stroke="#0a0a0a"
                        strokeWidth="2.5"
                      />
                      <circle cx="11" cy="11" r="2" fill="#0a0a0a" />
                      <circle cx="21" cy="11" r="2" fill="#0a0a0a" />
                      <circle cx="16" cy="16" r="2" fill="#0a0a0a" />
                      <circle cx="11" cy="21" r="2" fill="#0a0a0a" />
                      <circle cx="21" cy="21" r="2" fill="#0a0a0a" />
                    </svg>
                  </Button>
                  <Button
                    className="min-w-0 flex-1 text-sm sm:text-base lg:text-lg xl:text-xl"
                    size="lg"
                    disabled={isGenerating}
                    onClick={handleAdd}
                  >
                    {justAdded ? "Ajouté ✓" : "Ajouter au panier"}
                  </Button>
                </div>
                {justAdded ? (
                  <Link
                    href="/cart"
                    className="mt-2 inline-flex font-display text-xs font-bold uppercase text-hot-pink underline decoration-2 underline-offset-2 sm:text-sm lg:text-base"
                  >
                    Voir le panier →
                  </Link>
                ) : null}
              </>
            ) : (
              <Button
                className="mt-4 w-full text-sm sm:text-base lg:mt-5 lg:text-lg xl:text-xl"
                size="lg"
                disabled={!canGenerate}
                onClick={handleGenerate}
              >
                {isGenerating
                  ? brand.collection.generating
                  : brand.collection.generate}
              </Button>
            )}
            {hasFilters ? (
              <button
                type="button"
                onClick={resetFilters}
                className="mt-2 self-start text-xs font-bold uppercase text-hot-pink underline decoration-2 underline-offset-2 sm:text-sm lg:text-base"
              >
                Réinitialiser
              </button>
            ) : null}
          </motion.div>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 32, scale: 0.94 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              delay: reduced ? 0 : 0.28,
              duration: reduced ? 0.01 : 0.45,
              ease: spring,
            }}
            className="flex w-full flex-col lg:min-h-0"
          >
            <div className="relative flex w-full items-center justify-center lg:min-h-0 lg:flex-1">
              <div
                key={revealKey}
                className={cn(
                  "flex w-full items-center justify-center lg:h-full",
                  packBrainrot && "invisible",
                  selected && !packBrainrot && "animate-tee-reveal",
                )}
              >
              {selected ? (
                <Link
                  href={teePageHref(selected.id, size, resolvedColor)}
                  aria-label={selected.name}
                  className="flex h-full w-full max-w-[36rem] items-center justify-center"
                >
                  <TeeMockup
                    product={defaultProduct}
                    brainrot={selected}
                    color={resolvedColor}
                    className="h-full w-full max-w-full lg:max-h-full lg:!aspect-auto"
                    emptyLabel={brand.collection.pick}
                  />
                </Link>
              ) : (
                <TeeMockup
                  product={defaultProduct}
                  brainrot={selected}
                  color={resolvedColor}
                  className="w-full max-w-[36rem] lg:h-full lg:max-h-full lg:!aspect-auto"
                  emptyLabel={brand.collection.pick}
                />
              )}
            </div>
              {packBrainrot ? <PackRevealOverlay brainrot={packBrainrot} /> : null}
            </div>

            <div className="mt-2 w-full shrink-0 text-center">
              <p className="font-display text-[0.65rem] font-bold uppercase tracking-tight text-ink/70 sm:text-xs lg:text-sm xl:text-base">
                {defaultProduct.name} · <PriceTag />
              </p>
              {selected ? (
                <div className="mt-0.5 flex flex-wrap items-center justify-center gap-2">
                  <Link
                    href={teePageHref(selected.id, size, resolvedColor)}
                    className="font-display text-xl font-bold uppercase leading-none text-ink hover:text-hot-pink sm:text-2xl lg:text-3xl xl:text-4xl"
                  >
                    {selected.name}
                  </Link>
                  <Button
                    size="sm"
                    className="shrink-0 px-2.5 py-2"
                    disabled={isGenerating}
                    aria-label={justAdded ? "Ajouté au panier" : "Ajouter au panier"}
                    onClick={handleAdd}
                  >
                    {justAdded ? (
                      <span className="font-display text-lg leading-none">✓</span>
                    ) : (
                      <span className="font-display text-lg leading-none">+</span>
                    )}
                  </Button>
                </div>
              ) : (
                <p className="mt-0.5 font-display text-xl font-bold uppercase leading-none text-ink sm:text-2xl lg:text-3xl xl:text-4xl">
                  {brand.collection.pick}
                </p>
              )}
              <p className="mt-1.5 text-[0.65rem] font-bold text-ink/45 sm:text-xs lg:text-sm">
                {shippingNote}. {customProductNote}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
