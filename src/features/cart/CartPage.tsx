"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { brand } from "@/data/brand";
import { brainrots } from "@/data/brainrots";
import { sellableTeeSizes } from "@/data/fulfillment";
import { legal } from "@/data/legal";
import { formatEur, formatWelcomeOffer, shippingNote } from "@/data/pricing";
import { colorsForBrainrot } from "@/data/productAssets";
import { defaultProduct, products } from "@/data/products";
import { isTeeSize } from "@/data/sizes";
import { isTeeColor, teeColorLabel } from "@/data/teeColors";
import { UnusedCredit } from "@/features/account/UnusedCredit";
import { CartReassurance } from "@/features/cart/CartReassurance";
import { CheckoutPayBlock } from "@/features/cart/CheckoutPayBlock";
import { CheckoutProgress } from "@/features/cart/CheckoutProgress";
import { useCart } from "@/features/cart/CartProvider";
import { useCartQuote } from "@/features/cart/useCartQuote";
import { useCheckoutPay } from "@/features/cart/useCheckoutPay";
import { TeeMockup } from "@/features/generator/TeeMockup";
import { ColorSwatches } from "@/features/product/ColorSwatches";
import { SizeGuideDialog } from "@/features/product/SizeGuide";
import { teePageHref } from "@/features/product/teeSize";
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
    ? (brainrots.find((item) => item.id === pendingRemove.brainrotId)?.name ??
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
      <main className="mx-auto w-full max-w-3xl px-4 py-6 pb-28 sm:px-6 sm:pb-6">
        <CheckoutProgress step="cart" />

        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <h1 className="font-display text-[clamp(1.8rem,5vw,3rem)] font-bold uppercase leading-none text-ink">
            Panier
          </h1>
          <SizeGuideDialog />
        </div>

        {items.length === 0 ? (
          <div className="mt-6 rounded-2xl border-[3px] border-ink bg-white px-4 py-10 text-center shadow-sticker-sm">
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
            </div>
          </div>
        ) : (
          <>
            <ul className="mt-6 flex flex-col gap-3">
              {items.map((item) => {
                const brainrot = brainrots.find((b) => b.id === item.brainrotId);
                const product = products.find((p) => p.id === item.productId);
                if (!brainrot || !product) return null;
                const lineCents = item.quantity * quote.shop.teePriceCents;
                const teeHref =
                  isTeeSize(item.size) && isTeeColor(item.color)
                    ? teePageHref(brainrot.id, item.size, item.color)
                    : isTeeSize(item.size)
                      ? teePageHref(brainrot.id, item.size)
                      : `/tee/${brainrot.id}`;
                return (
                  <li
                    key={item.id}
                    className="flex flex-col gap-3 rounded-2xl border-[3px] border-ink bg-white p-3 shadow-sticker-sm sm:flex-row sm:items-center"
                  >
                    <Link
                      href={teeHref}
                      className="relative mx-auto w-24 shrink-0 sm:mx-0 sm:w-28"
                    >
                      <TeeMockup
                        product={defaultProduct}
                        brainrot={brainrot}
                        color={item.color}
                        className="max-w-none"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={teeHref}
                        className="font-display text-lg font-bold leading-tight text-ink hover:text-hot-pink"
                      >
                        {brainrot.name}
                      </Link>
                      <p className="text-sm font-bold text-ink/60">
                        {product.name} · {teeColorLabel(item.color)} ·{" "}
                        {formatEur(quote.shop.teePriceCents)}
                      </p>
                      <div className="mt-2">
                        <ColorSwatches
                          colors={colorsForBrainrot(brainrot)}
                          value={
                            isTeeColor(item.color) ? item.color : "white"
                          }
                          onChange={(id) => setColor(item.id, id)}
                        />
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {sizes.map((value) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setSize(item.id, value)}
                            className={
                              item.size === value
                                ? "rounded-pill border-[3px] border-ink bg-acid-yellow px-2 py-0.5 font-display text-[0.65rem] font-bold uppercase shadow-sticker-sm"
                                : "rounded-pill border-[3px] border-ink bg-white px-2 py-0.5 font-display text-[0.65rem] font-bold uppercase text-ink/70"
                            }
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          aria-label={
                            item.quantity <= 1 ? "Retirer l’article" : "Moins"
                          }
                          onClick={() => {
                            if (item.quantity <= 1) {
                              setRemoveId(item.id);
                              return;
                            }
                            setQuantity(item.id, item.quantity - 1);
                          }}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-pill border-[3px] border-ink bg-white font-display text-sm font-bold"
                        >
                          −
                        </button>
                        <span className="min-w-[1.5rem] text-center font-display text-sm font-bold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Plus"
                          onClick={() =>
                            setQuantity(item.id, item.quantity + 1)
                          }
                          className="inline-flex h-8 w-8 items-center justify-center rounded-pill border-[3px] border-ink bg-white font-display text-sm font-bold"
                        >
                          +
                        </button>
                        <span className="ml-auto font-display text-sm font-bold text-ink">
                          {formatEur(lineCents)}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-4">
              <Link
                href="/#compose"
                className="font-display text-sm font-bold uppercase text-hot-pink underline decoration-2 underline-offset-2"
              >
                Continuer mes achats →
              </Link>
            </div>

            <div className="mt-6">
              <CartReassurance />
            </div>

            {!quote.me && quote.shop.welcomeLive && quote.shop.welcomeRequiresAccount ? (
              <div className="mt-4 rounded-2xl border-[3px] border-ink bg-acid-yellow px-4 py-3 shadow-sticker-sm">
                <p className="font-display text-sm font-bold uppercase text-ink">
                  {formatWelcomeOffer(quote.shop)} avec le code {quote.shop.welcomeCode}
                </p>
                <p className="mt-1 text-sm font-bold text-ink/70">
                  Crée un compte, puis entre le code au paiement.
                </p>
                <Link
                  href="/compte/inscription?next=/cart"
                  className="mt-1 inline-block text-sm font-bold text-hot-pink underline"
                >
                  Créer un compte →
                </Link>
              </div>
            ) : null}

            {quote.guestCashbackCents > 0 ? (
              <div className="mt-4 rounded-2xl border-[3px] border-ink bg-white px-4 py-3 shadow-sticker-sm">
                <p className="font-display text-sm font-bold uppercase text-ink">
                  + {formatEur(quote.guestCashbackCents)} de crédit si tu es
                  connecté
                </p>
                <Link
                  href="/compte/inscription?next=/cart"
                  className="mt-1 inline-block text-sm font-bold text-hot-pink underline"
                >
                  Créer un compte →
                </Link>
              </div>
            ) : null}

            {quote.me && quote.me.creditCents > 0 ? (
              <div className="mt-4">
                <UnusedCredit cents={quote.me.creditCents} />
              </div>
            ) : null}

            <div id="promo" className="mt-4 scroll-mt-28">
              <p className="text-xs font-bold uppercase tracking-wide text-hot-pink">
                Code promo
              </p>
              <div className="mt-1 flex flex-col gap-2 sm:flex-row">
                <input
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
                  className="w-full rounded-xl border-[3px] border-ink bg-white px-4 py-3 font-display text-sm font-bold uppercase text-ink placeholder:normal-case placeholder:text-ink/30 shadow-sticker-sm"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="shrink-0 sm:self-stretch sm:px-5"
                  disabled={testingCode || draftCode.trim().length === 0}
                  onClick={() => void testPromoCode()}
                >
                  {testingCode ? "…" : "Tester"}
                </Button>
              </div>
              {promoStatus === "ok" ? (
                <p className="mt-2 text-sm font-bold text-ink/70">
                  Code {quote.welcomeCode} valable · −
                  {formatEur(quote.welcomeAppliedCents)}
                </p>
              ) : null}
              {promoStatus === "needsAccount" ? (
                <p className="mt-2 text-sm font-bold text-ink/70">
                  Ce code demande un compte.{" "}
                  <Link
                    href="/compte/inscription?next=/cart"
                    className="text-hot-pink underline"
                  >
                    Créer un compte
                  </Link>
                </p>
              ) : null}
              {promoStatus === "invalid" ? (
                <p className="mt-2 text-sm font-bold text-hot-pink">
                  Code invalide ou déjà utilisé.
                </p>
              ) : null}
            </div>

            <div className="mt-4 rounded-2xl border-[3px] border-ink bg-white p-4 shadow-sticker-sm">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-bold text-ink/60">Sous-total</p>
                <p className="text-sm font-bold text-ink">
                  {formatEur(quote.subtotalCents)}
                </p>
              </div>
              {quote.welcomeAppliedCents > 0 ? (
                <div className="mt-1 flex items-baseline justify-between gap-3">
                  <p className="text-sm font-bold text-ink/60">
                    Code {quote.welcomeCode}
                  </p>
                  <p className="text-sm font-bold text-ink">
                    −{formatEur(quote.welcomeAppliedCents)}
                  </p>
                </div>
              ) : null}
              {quote.creditAppliedCents > 0 ? (
                <div className="mt-1 flex items-baseline justify-between gap-3">
                  <p className="text-sm font-bold text-ink/60">Crédit</p>
                  <p className="text-sm font-bold text-ink">
                    −{formatEur(quote.creditAppliedCents)}
                  </p>
                </div>
              ) : null}
              <div className="mt-3 flex items-baseline justify-between gap-3 border-t-[3px] border-ink/10 pt-3">
                <p className="font-display text-base font-bold uppercase text-ink">
                  Total
                </p>
                <p className="font-display text-xl font-bold uppercase text-ink">
                  {formatEur(quote.totalCents)} TTC
                </p>
              </div>
              {quote.cashbackPreviewCents > 0 ? (
                <p className="mt-2 text-sm font-bold text-ink/70">
                  Tu gagnes {formatEur(quote.cashbackPreviewCents)} de crédit
                  après cette commande.
                </p>
              ) : null}
              <p className="mt-1 text-sm font-bold text-ink/55">
                {shippingNote} · {legal.deliveryEstimate}
              </p>
            </div>

            <div className="mt-4">
              <CheckoutPayBlock
                totalCents={quote.totalCents}
                pending={pending}
                error={error}
                onPay={pay}
              />
            </div>
          </>
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
              className="inline-flex shrink-0 items-center justify-center rounded-pill border-[3px] border-ink bg-hot-pink px-5 py-2.5 font-display text-sm font-bold uppercase tracking-tight text-white shadow-sticker-sm"
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
