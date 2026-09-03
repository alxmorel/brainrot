"use client";

import Link from "next/link";
import { legal } from "@/data/legal";
import { defaultProduct } from "@/data/products";
import { formatEur } from "@/data/pricing";
import { TeeMockup } from "@/features/generator/TeeMockup";
import { MysteryMockup } from "@/features/mystery/MysteryMockup";
import { brainrots } from "@/data/brainrots";
import type { PublicOrderTimelineStep, PublicOrderView } from "@/models";

function OrderTimeline({ steps }: { steps: PublicOrderTimelineStep[] }) {
  if (steps.length === 0) return null;
  return (
    <ol className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-1">
      {steps.map((step, index) => (
        <li
          key={step.id}
          className="flex min-w-0 flex-1 items-center gap-2 sm:flex-col sm:items-center sm:text-center"
        >
          <span
            className={[
              "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-[2.5px] border-ink font-display text-xs font-bold",
              step.done
                ? "bg-acid-yellow text-ink"
                : step.current
                  ? "bg-hot-pink text-white"
                  : "bg-white text-ink/35",
            ].join(" ")}
            aria-current={step.current ? "step" : undefined}
          >
            {step.done ? "✓" : index + 1}
          </span>
          <span
            className={[
              "font-display text-[0.7rem] font-bold uppercase leading-tight",
              step.done || step.current ? "text-ink" : "text-ink/35",
            ].join(" ")}
          >
            {step.label}
          </span>
        </li>
      ))}
    </ol>
  );
}

export function OrderStatusCard({ order }: { order: PublicOrderView }) {
  const hasTracking = Boolean(order.tracking || order.trackingUrl || order.carrier);

  return (
    <div className="w-full rotate-[-1deg] rounded-[1.5rem] border-[3px] border-ink bg-white p-4 shadow-sticker sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-xs font-bold uppercase tracking-tight text-ink/50">
            Numéro de commande
          </p>
          <p className="mt-1 break-all font-display text-2xl font-bold uppercase leading-none tracking-[-0.04em] text-ink">
            {order.id}
          </p>
        </div>
        <p className="rounded-pill border-[3px] border-ink bg-acid-yellow px-3 py-1 font-display text-xs font-bold uppercase tracking-tight shadow-sticker-sm">
          {order.statusLabel}
        </p>
      </div>

      <OrderTimeline steps={order.timeline} />

      {order.etaLabel ? (
        <p className="mt-3 text-sm font-bold text-ink/60">{order.etaLabel}</p>
      ) : null}

      {hasTracking ? (
        <div className="mt-4 rounded-xl border-[3px] border-ink bg-ink-soft p-3">
          {order.carrier ? (
            <>
              <p className="text-xs font-bold uppercase text-ink/50">Transporteur</p>
              <p className="mt-1 font-display text-sm font-bold text-ink">{order.carrier}</p>
            </>
          ) : null}
          {order.tracking ? (
            <>
              <p
                className={`text-xs font-bold uppercase text-ink/50 ${order.carrier ? "mt-3" : ""}`}
              >
                N° de suivi
              </p>
              <p className="mt-1 font-display text-sm font-bold text-ink">{order.tracking}</p>
            </>
          ) : null}
          {order.trackingUrl ? (
            <a
              href={order.trackingUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex rounded-pill border-[3px] border-ink bg-hot-pink px-5 py-2.5 font-display text-sm font-bold uppercase tracking-tight text-white shadow-sticker-sm"
            >
              Suivre le colis →
            </a>
          ) : null}
        </div>
      ) : order.isPaid && order.status !== "cancelled" ? (
        <p className="mt-4 text-sm font-bold text-ink/55">{legal.trackingFollowUp}</p>
      ) : null}

      <ul className="mt-5 flex flex-col gap-3 border-t-[3px] border-ink/10 pt-4">
        {order.items.map((item, index) => {
          const brainrot = item.mystery
            ? null
            : brainrots.find((b) => b.id === item.brainrotId);
          return (
            <li key={`${item.brainrotId}-${item.size}-${item.color}-${index}`} className="flex gap-3">
              <div className="w-16 shrink-0">
                {item.mystery ? (
                  <MysteryMockup className="max-w-none" />
                ) : brainrot ? (
                  <TeeMockup
                    product={defaultProduct}
                    brainrot={brainrot}
                    color={item.color}
                    className="max-w-none"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-bold uppercase leading-tight text-ink">
                  {item.name}
                </p>
                <p className="text-xs font-bold text-ink/60">
                  {item.size} · {item.colorLabel} · ×{item.quantity}
                </p>
                <p className="mt-1 font-display text-sm font-bold text-ink">
                  {formatEur(item.lineCents)}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 flex items-baseline justify-between border-t-[3px] border-ink pt-3 font-display text-base font-bold uppercase">
        <span>Total</span>
        <span>{formatEur(order.totalCents)} TTC</span>
      </p>
      {order.discountCents > 0 ? (
        <p className="mt-1 text-right text-xs font-bold text-ink/55">
          dont −{formatEur(order.discountCents)} de réduction
        </p>
      ) : null}

      <p className="mt-4 text-xs font-bold text-ink/45">
        Une question ?{" "}
        <a href={`mailto:${legal.email}`} className="underline text-ink/60">
          {legal.email}
        </a>
      </p>
    </div>
  );
}

export function OrderStatusLinks() {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
      <Link
        href="/#compose"
        className="inline-flex rounded-pill border-[3px] border-ink bg-hot-pink px-6 py-3 font-display text-sm font-bold uppercase tracking-tight text-white shadow-sticker"
      >
        Créer un autre →
      </Link>
      <Link
        href="/"
        className="inline-flex rounded-pill border-[3px] border-ink bg-white px-6 py-3 font-display text-sm font-bold uppercase tracking-tight text-ink shadow-sticker-sm"
      >
        Accueil
      </Link>
    </div>
  );
}
