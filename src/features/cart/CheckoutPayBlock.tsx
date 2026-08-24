"use client";

import Link from "next/link";
import { legal } from "@/data/legal";
import { customProductNote, formatEur, shippingNote } from "@/data/pricing";
import { Button } from "@/shared/components/ui";

export function CheckoutPayBlock({
  totalCents,
  pending,
  error,
  onPay,
}: {
  totalCents: number;
  pending: boolean;
  error: string | null;
  onPay: (cgvAccepted: boolean) => void;
}) {
  return (
    <div
      id="paiement"
      className="scroll-mt-24 rounded-2xl border-[3px] border-ink bg-white p-4 shadow-sticker-sm"
    >
      <h2 className="font-display text-lg font-bold uppercase text-ink">
        Paiement
      </h2>
      <p className="mt-1 text-sm font-bold text-ink/70">
        Adresse et carte sur la page sécurisée Stripe — {shippingNote},{" "}
        {legal.deliveryEstimate.toLowerCase()}.
      </p>

      <p className="mt-3 rounded-xl border-[3px] border-ink/15 bg-ink-soft px-3 py-2 text-xs font-bold leading-snug text-ink/75">
        {customProductNote}
      </p>

      <label className="mt-4 flex items-start gap-2 text-sm font-bold text-ink/75">
        <input
          id="checkout-cgv"
          type="checkbox"
          className="mt-1 size-4 accent-hot-pink"
        />
        <span>
          J’accepte les{" "}
          <Link href="/cgv" className="underline hover:text-hot-pink">
            CGV
          </Link>{" "}
          et la{" "}
          <Link
            href="/confidentialite"
            className="underline hover:text-hot-pink"
          >
            politique de confidentialité
          </Link>
          .
        </span>
      </label>

      {error ? (
        <p className="mt-3 text-sm font-bold text-hot-pink">{error}</p>
      ) : null}

      <Button
        type="button"
        className="mt-4 w-full"
        disabled={pending}
        onClick={() => {
          const cgv = document.getElementById(
            "checkout-cgv",
          ) as HTMLInputElement | null;
          onPay(Boolean(cgv?.checked));
        }}
      >
        {pending ? "Redirection…" : `Payer ${formatEur(totalCents)}`}
      </Button>

      <p className="mt-2 text-center text-xs font-bold text-ink/45">
        Paiement sécurisé par Stripe
      </p>
    </div>
  );
}
