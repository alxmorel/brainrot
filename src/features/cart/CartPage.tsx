"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { brand } from "@/data/brand";
import { brainrots } from "@/data/brainrots";
import { sellableTeeSizes } from "@/data/fulfillment";
import { legal } from "@/data/legal";
import { isMysteryCartItem } from "@/data/mystery";
import { cartLineUnitCents, formatEur, shippingNote } from "@/data/pricing";
import { colorsForBrainrot } from "@/data/productAssets";
import { defaultProduct, products } from "@/data/products";
import { isTeeSize } from "@/data/sizes";
import { defaultTeeColor, isTeeColor, teeColorIds, type TeeColorId } from "@/data/teeColors";
import { UnusedCredit } from "@/features/account/UnusedCredit";
import { CartReassurance } from "@/features/cart/CartReassurance";
import { CheckoutPayBlock } from "@/features/cart/CheckoutPayBlock";
import { CheckoutProgress } from "@/features/cart/CheckoutProgress";
import { useCart } from "@/features/cart/CartProvider";
import { useCartQuote } from "@/features/cart/useCartQuote";
import { useCheckoutPay } from "@/features/cart/useCheckoutPay";
import { TeeMockup } from "@/features/generator/TeeMockup";
import { MysteryMockup } from "@/features/mystery/MysteryMockup";
import { ColorSwatches } from "@/features/product/ColorSwatches";
import { SizeGuideDialog } from "@/features/product/SizeGuide";
import { SizePicker } from "@/features/product/SizePicker";
import { teePageHref } from "@/features/product/teeSize";
import type { CartItem } from "@/models";
import { ComposeLink } from "@/shared/components/layout/ComposeLink";
import { SiteFooter } from "@/shared/components/layout/SiteFooter";
import { SiteNav } from "@/shared/components/layout/SiteNav";
import { Button } from "@/shared/components/ui";
import { track } from "@/shared/utils/track";

export function CartPage() {
  const { items, removeItem, setQuantity, setSize, setColor } = useCart();
  const sizes = sellableTeeSizes();
  const [draftCode, setDraftCode] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [promoStatus, setPromoStatus] = useState<
    null | "ok" | "needsAccount" | "invalid"
  >(null);
  const [testingCode, setTestingCode] = useState(false);
  const quote = useCartQuote(items, appliedCode);
  const { pay, error, pending } = useCheckoutPay(items, appliedCode);
  const [removeId, setRemoveId] = useState<string | null>(null);
  const pendingRemove = items.find((item) => item.id === removeId);
  const pendingName = pendingRemove
    ? isMysteryCartItem(pendingRemove)
      ? brand.mystery.name
      : (brainrots.find((item) => item.id === pendingRemove.brainrotId)?.name ??
        "cet article")
    : "";

  useEffect(() => {
    track("view_cart", { items: items.length });
  }, [items.length]);

  async function testPromoCode() {
    const code = draftCode.trim();
    if (!code) {
      setPromoStatus("invalid");
      setAppliedCode(null);
      return;
    }
    setTestingCode(true);
    setPromoStatus(null);
    const response = await fetch(
      `/api/account/promo?code=${encodeURIComponent(code)}`,
    );
    const json: unknown = await response.json().catch(() => null);
    setTestingCode(false);
    if (
      json &&
      typeof json === "object" &&
      "ok" in json &&
      (json as { ok: unknown }).ok
    ) {
      const confirmed =
        "code" in json && typeof (json as { code: unknown }).code === "string"
          ? (json as { code: string }).code
          : code;
      setAppliedCode(confirmed);
      setPromoStatus("ok");
      return;
    }
    setAppliedCode(null);
    const needsAccount =
      json &&
      typeof json === "object" &&
      "needsAccount" in json &&
      Boolean((json as { needsAccount: unknown }).needsAccount);
    setPromoStatus(needsAccount ? "needsAccount" : "invalid");
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteNav />
      <main className="mx-auto w-full max-w-[1200px] px-4 py-6 pb-28 sm:px-6 lg:px-8 lg:pb-10">
        <CheckoutProgress step="cart" />

        <div className="mt-4 flex flex-wrap items-end gap-x-4 gap-y-2">
          <h1 className="font-display text-[clamp(1.85rem,5vw,3rem)] font-bold uppercase leading-none tracking-[-0.03em] text-ink">
            Panier
          </h1>
          <SizeGuideDialog />
        </div>

        {items.length === 0 ? (
          <div className="mx-auto mt-8 max-w-lg rounded-2xl border-[3px] border-ink bg-white px-4 py-10 text-center shadow-sticker-sm">
            <p className="font-display text-lg font-bold uppercase text-ink">
              Panier vide
            </p>
            <p className="mt-1 text-sm font-bold text-ink/60">
              Compose un combo. Rejoins la bande.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <ComposeLink
                cta="composer"
                source="cart"
                className="inline-flex items-center justify-center rounded-pill border-[3px] border-ink bg-hot-pink px-6 py-3 font-display text-sm font-bold uppercase tracking-tight text-white shadow-sticker"
              >
                {brand.hero.cta}
              </ComposeLink>
              <Link
                href="/mystery"
                className="inline-flex items-center justify-center rounded-pill border-[3px] border-ink bg-acid-yellow px-6 py-3 font-display text-sm font-bold uppercase tracking-tight text-ink shadow-sticker-sm"
              >
                {brand.mystery.cta}
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_21rem] xl:grid-cols-[minmax(0,1fr)_23rem]">
            <section aria-label="Articles du panier">
              <ul className="divide-y divide-ink/15 border-y border-ink/15">
                {items.map((item) => {
                  const mystery = isMysteryCartItem(item);
                  const brainrot = mystery
                    ? null
                    : (brainrots.find((b) => b.id === item.brainrotId) ?? null);
                  const product = products.find((p) => p.id === item.productId);
                  if ((!mystery && !brainrot) || !product) return null;
                  const unitCents = cartLineUnitCents(item, quote.shop);
                  const palette = mystery
                    ? [...teeColorIds]
                    : colorsForBrainrot(brainrot!);
                  return (
                    <CartLine
                      key={item.id}
                      item={item}
                      name={mystery ? brand.mystery.name : brainrot!.name}
                      productName={product.name}
                      mystery={mystery}
                      mysteryLegal={mystery ? brand.mystery.legal : null}
                      teeHref={lineHref(item, mystery, brainrot?.id)}
                      unitCents={unitCents}
                      sizes={sizes}
                      palette={palette}
                      brainrot={brainrot}
                      onSetSize={setSize}
                      onSetColor={setColor}
                      onSetQuantity={setQuantity}
                      onRemove={() => setRemoveId(item.id)}
                    />
                  );
                })}
              </ul>

              <div className="mt-5">
                <Link
                  href="/#compose"
                  className="inline-flex min-h-10 items-center font-display text-sm font-bold uppercase text-hot-pink underline decoration-2 underline-offset-4"
                >
                  Continuer mes achats →
                </Link>
              </div>

              <div className="mt-6">
                <CartReassurance />
              </div>
            </section>

            <aside className="flex flex-col gap-5 lg:sticky lg:top-28 lg:self-start">
              <section
                aria-labelledby="cart-recap-title"
                className="rounded-2xl border-[3px] border-ink bg-white p-4 shadow-sticker-sm sm:p-5"
              >
                <h2
                  id="cart-recap-title"
                  className="font-display text-lg font-bold uppercase text-ink"
                >
                  Récapitulatif
                </h2>
                <dl className="mt-3 space-y-2">
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="text-sm font-bold text-ink/60">Sous-total</dt>
                    <dd className="text-sm font-bold text-ink">
                      {formatEur(quote.subtotalCents)}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="text-sm font-bold text-ink/60">Livraison</dt>
                    <dd className="text-sm font-bold text-ink">{shippingNote}</dd>
                  </div>
                  {quote.welcomeAppliedCents > 0 ? (
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="text-sm font-bold text-ink/60">
                        Code {quote.welcomeCode}
                      </dt>
                      <dd className="text-sm font-bold text-ink">
                        −{formatEur(quote.welcomeAppliedCents)}
                      </dd>
                    </div>
                  ) : null}
                  {quote.creditAppliedCents > 0 ? (
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="text-sm font-bold text-ink/60">Crédit</dt>
                      <dd className="text-sm font-bold text-ink">
                        −{formatEur(quote.creditAppliedCents)}
                      </dd>
                    </div>
                  ) : null}
                </dl>
                <div className="mt-4 flex items-baseline justify-between gap-3 border-t-[3px] border-ink pt-3">
                  <p className="font-display text-lg font-bold uppercase text-ink">
                    Total
                  </p>
                  <p className="font-display text-2xl font-bold uppercase leading-none text-ink">
                    {formatEur(quote.totalCents)}{" "}
                    <span className="text-base">TTC</span>
                  </p>
                </div>
                {quote.cashbackPreviewCents > 0 ? (
                  <p className="mt-2 text-sm font-bold text-ink/70">
                    Tu gagnes {formatEur(quote.cashbackPreviewCents)} de crédit
                    après cette commande.
                  </p>
                ) : null}
                <p className="mt-2 text-sm font-bold leading-snug text-ink/55">
                  {legal.deliveryEstimate}
                </p>
              </section>

              <section
                aria-labelledby="cart-promo-title"
                id="promo"
                className="scroll-mt-28"
              >
                <h2
                  id="cart-promo-title"
                  className="font-display text-base font-bold uppercase text-ink"
                >
                  Réductions
                </h2>

                {quote.me && quote.me.creditCents > 0 ? (
                  <div className="mt-2">
                    <UnusedCredit cents={quote.me.creditCents} />
                  </div>
                ) : null}

                <label
                  htmlFor="cart-promo-code"
                  className="mt-2 block text-xs font-bold uppercase tracking-wide text-ink/55"
                >
                  Code promo
                </label>
                <div className="mt-1 flex gap-2">
                  <input
                    id="cart-promo-code"
                    value={draftCode}
                    onChange={(event) => {
                      setDraftCode(event.target.value);
                      setAppliedCode(null);
                      setPromoStatus(null);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        void testPromoCode();
                      }
                    }}
                    placeholder="Saisir un code"
                    autoCapitalize="characters"
                    autoComplete="off"
                    spellCheck={false}
                    className="min-w-0 flex-1 rounded-xl border-[3px] border-ink bg-white px-3 py-2 font-display text-sm font-bold uppercase text-ink placeholder:normal-case placeholder:text-ink/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hot-pink focus-visible:ring-offset-2"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-10 shrink-0 px-4"
                    disabled={testingCode || draftCode.trim().length === 0}
                    onClick={() => void testPromoCode()}
                  >
                    {testingCode ? "…" : "Tester"}
                  </Button>
                </div>
                {promoStatus === "ok" ? (
                  <p className="mt-1.5 text-sm font-bold text-ink/70">
                    Code {quote.welcomeCode} valable · −
                    {formatEur(quote.welcomeAppliedCents)}
                  </p>
                ) : null}
                {promoStatus === "needsAccount" ? (
                  <p className="mt-1.5 text-sm font-bold text-ink/70">
                    Ce code demande un compte.
                  </p>
                ) : null}
                {promoStatus === "invalid" ? (
                  <p className="mt-1.5 text-sm font-bold text-hot-pink">
                    Code invalide ou déjà utilisé.
                  </p>
                ) : null}
              </section>

              <div className="rounded-2xl border-[3px] border-ink bg-white p-4 shadow-sticker-sm sm:p-5">
                <CheckoutPayBlock
                  totalCents={quote.totalCents}
                  pending={pending}
                  error={error}
                  hasMystery={items.some(isMysteryCartItem)}
                  onPay={pay}
                />
              </div>
            </aside>
          </div>
        )}
      </main>

      {items.length > 0 ? (
        <div className="fixed inset-x-3 bottom-3 z-30 lg:hidden">
          <div className="flex items-center justify-between gap-3 rounded-2xl border-[3px] border-ink bg-white p-3 shadow-sticker">
            <div>
              <p className="font-display text-xs font-bold uppercase text-ink/55">
                Total TTC
              </p>
              <p className="font-display text-lg font-bold uppercase text-ink">
                {formatEur(quote.totalCents)}
              </p>
            </div>
            <a
              href="#paiement"
              className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-pill border-[3px] border-ink bg-hot-pink px-5 py-2.5 font-display text-sm font-bold uppercase tracking-tight text-white shadow-sticker-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hot-pink focus-visible:ring-offset-2"
            >
              Payer →
            </a>
          </div>
        </div>
      ) : null}

      <SiteFooter />
      {removeId ? (
        <RemoveItemDialog
          name={pendingName}
          onCancel={() => setRemoveId(null)}
          onConfirm={() => {
            removeItem(removeId);
            setRemoveId(null);
          }}
        />
      ) : null}
    </div>
  );
}

function lineHref(
  item: CartItem,
  mystery: boolean,
  brainrotId: string | undefined,
) {
  if (mystery) return "/mystery";
  if (!brainrotId) return "/";
  if (isTeeSize(item.size) && isTeeColor(item.color)) {
    return teePageHref(brainrotId, item.size, item.color);
  }
  if (isTeeSize(item.size)) return teePageHref(brainrotId, item.size);
  return `/tee/${brainrotId}`;
}

function CartLine({
  item,
  name,
  productName,
  mystery,
  mysteryLegal,
  teeHref,
  unitCents,
  sizes,
  palette,
  brainrot,
  onSetSize,
  onSetColor,
  onSetQuantity,
  onRemove,
}: {
  item: CartItem;
  name: string;
  productName: string;
  mystery: boolean;
  mysteryLegal: string | null;
  teeHref: string;
  unitCents: number;
  sizes: string[];
  palette: TeeColorId[];
  brainrot: (typeof brainrots)[number] | null;
  onSetSize: (id: string, size: string) => void;
  onSetColor: (id: string, color: string) => void;
  onSetQuantity: (id: string, quantity: number) => void;
  onRemove: () => void;
}) {
  const lineCents = item.quantity * unitCents;

  return (
    <li className="grid grid-cols-[5.75rem_minmax(0,1fr)_auto] items-start gap-x-3 py-4 sm:grid-cols-[6.75rem_minmax(0,1fr)_auto] sm:gap-x-4 sm:py-5">
      <Link href={teeHref} className="relative w-full shrink-0">
        {mystery ? (
          <MysteryMockup className="max-w-none" />
        ) : (
          <TeeMockup
            product={defaultProduct}
            brainrot={brainrot}
            color={item.color}
            className="max-w-none"
          />
        )}
      </Link>
      <div className="min-w-0">
        <Link
          href={teeHref}
          className="font-display text-lg font-bold leading-tight break-words text-ink hover:text-hot-pink sm:text-xl"
        >
          {name}
        </Link>
        <p className="mt-0.5 text-sm font-bold text-ink/60">{productName}</p>
        {mysteryLegal ? (
          <p className="mt-1 text-sm font-bold leading-snug text-ink/55">
            {mysteryLegal}
          </p>
        ) : null}

        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="inline-flex items-center gap-1.5">
            <span className="text-sm font-bold text-ink/65">Taille</span>
            <SizePicker
              sizes={sizes}
              value={item.size}
              name={name}
              onChange={(size) => onSetSize(item.id, size)}
            />
          </span>
          <ColorSwatches
            compact
            colors={palette}
            value={isTeeColor(item.color) ? item.color : defaultTeeColor}
            onChange={(id) => onSetColor(item.id, id)}
          />
          <span className="inline-flex items-center gap-1.5">
            <span className="text-sm font-bold text-ink/65">Qté</span>
            <QuantityStepper
              quantity={item.quantity}
              name={name}
              onDecrease={() => {
                if (item.quantity <= 1) {
                  onRemove();
                  return;
                }
                onSetQuantity(item.id, item.quantity - 1);
              }}
              onIncrease={() => onSetQuantity(item.id, item.quantity + 1)}
            />
          </span>
        </div>
      </div>
      <p className="w-[5.5rem] shrink-0 text-right font-display text-base font-bold tabular-nums leading-tight text-ink sm:w-[6.25rem] sm:text-lg">
        {formatEur(lineCents)}
      </p>
    </li>
  );
}

function QuantityStepper({
  quantity,
  name,
  onDecrease,
  onIncrease,
}: {
  quantity: number;
  name: string;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <div
      className="inline-flex items-center rounded-pill border-[3px] border-ink bg-white"
      role="group"
      aria-label={`Quantité de ${name}`}
    >
      <button
        type="button"
        aria-label={
          quantity <= 1 ? `Retirer ${name}` : `Diminuer la quantité de ${name}`
        }
        onClick={onDecrease}
        className="inline-flex h-10 w-10 items-center justify-center rounded-l-pill font-display text-lg font-bold text-ink transition-colors hover:bg-acid-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hot-pink focus-visible:ring-offset-2"
      >
        −
      </button>
      <span
        className="min-w-[1.35rem] text-center font-display text-sm font-bold tabular-nums"
        aria-live="polite"
      >
        {quantity}
      </span>
      <button
        type="button"
        aria-label={`Augmenter la quantité de ${name}`}
        onClick={onIncrease}
        className="inline-flex h-10 w-10 items-center justify-center rounded-r-pill font-display text-lg font-bold text-ink transition-colors hover:bg-acid-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hot-pink focus-visible:ring-offset-2"
      >
        +
      </button>
    </div>
  );
}

function RemoveItemDialog({
  name,
  onCancel,
  onConfirm,
}: {
  name: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onCancel]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="remove-item-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-3 sm:items-center"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-2xl border-[3px] border-ink bg-white p-5 shadow-sticker sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <h2
          id="remove-item-title"
          className="font-display text-xl font-bold uppercase leading-none text-ink"
        >
          Retirer du panier ?
        </h2>
        <p className="mt-3 text-sm font-bold text-ink/70">
          {name} sera enlevé du panier.
        </p>
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Annuler
          </Button>
          <Button variant="danger" size="sm" onClick={onConfirm}>
            Retirer
          </Button>
        </div>
      </div>
    </div>
  );
}
