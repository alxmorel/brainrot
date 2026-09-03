"use client";

import { formatOpsDay } from "@/features/ops/OpsPeriodToggle";
import type { OpsFunnelInsight, OpsFunnelStepStat } from "@/models";

function ChartEmpty() {
  return (
    <p className="flex h-36 items-center justify-center text-sm font-bold text-ink/50">
      Pas assez de données
    </p>
  );
}

export function OpsBarChart({
  points,
  formatValue = String,
  colorClass = "bg-hot-pink",
}: {
  points: { day: string; value: number }[];
  formatValue?: (value: number) => string;
  colorClass?: string;
}) {
  if (points.length === 0 || points.every((point) => point.value === 0)) {
    return <ChartEmpty />;
  }

  const max = Math.max(1, ...points.map((point) => point.value));
  const labelEvery = Math.max(1, Math.ceil(points.length / 8));

  return (
    <div>
      <div className="flex h-36 items-end gap-px sm:gap-0.5">
        {points.map((point) => {
          const pct = (point.value / max) * 100;
          return (
            <div
              key={point.day}
              className="flex min-w-0 flex-1 flex-col items-center justify-end"
              title={`${formatOpsDay(point.day)} · ${formatValue(point.value)}`}
            >
              <div
                className={`w-full rounded-t-sm border-[1.5px] border-ink ${colorClass} ${point.value > 0 ? "" : "opacity-0"}`}
                style={{ height: `${point.value > 0 ? Math.max(pct, 6) : 0}%` }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-1 flex gap-px sm:gap-0.5 text-[0.6rem] font-bold text-ink/45">
        {points.map((point, index) => (
          <span key={point.day} className="min-w-0 flex-1 truncate text-center">
            {index === 0 ||
            index === points.length - 1 ||
            index % labelEvery === 0
              ? formatOpsDay(point.day)
              : "\u00a0"}
          </span>
        ))}
      </div>
    </div>
  );
}

export function OpsTwinChart({
  points,
  left,
  right,
}: {
  points: { day: string; left: number; right: number }[];
  left: { label: string; format?: (value: number) => string; colorClass: string };
  right: { label: string; format?: (value: number) => string; colorClass: string };
}) {
  if (
    points.length === 0 ||
    points.every((point) => point.left === 0 && point.right === 0)
  ) {
    return <ChartEmpty />;
  }

  const max = Math.max(
    1,
    ...points.flatMap((point) => [point.left, point.right]),
  );
  const labelEvery = Math.max(1, Math.ceil(points.length / 8));
  const leftFmt = left.format ?? String;
  const rightFmt = right.format ?? String;

  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-3 text-[0.65rem] font-bold uppercase">
        <span className="inline-flex items-center gap-1.5">
          <span className={`inline-block h-2.5 w-2.5 border-[1.5px] border-ink ${left.colorClass}`} />
          {left.label}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className={`inline-block h-2.5 w-2.5 border-[1.5px] border-ink ${right.colorClass}`} />
          {right.label}
        </span>
      </div>
      <div className="flex h-36 items-end gap-px sm:gap-0.5">
        {points.map((point) => (
          <div
            key={point.day}
            className="flex min-w-0 flex-1 items-end justify-center gap-px"
            title={`${formatOpsDay(point.day)} · ${left.label} ${leftFmt(point.left)} · ${right.label} ${rightFmt(point.right)}`}
          >
            <div
              className={`w-full max-w-[8px] rounded-t-sm border-[1.5px] border-ink ${left.colorClass} ${point.left > 0 ? "" : "opacity-0"}`}
              style={{ height: `${point.left > 0 ? Math.max((point.left / max) * 100, 6) : 0}%` }}
            />
            <div
              className={`w-full max-w-[8px] rounded-t-sm border-[1.5px] border-ink ${right.colorClass} ${point.right > 0 ? "" : "opacity-0"}`}
              style={{ height: `${point.right > 0 ? Math.max((point.right / max) * 100, 6) : 0}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-1 flex gap-px sm:gap-0.5 text-[0.6rem] font-bold text-ink/45">
        {points.map((point, index) => (
          <span key={point.day} className="min-w-0 flex-1 truncate text-center">
            {index === 0 ||
            index === points.length - 1 ||
            index % labelEvery === 0
              ? formatOpsDay(point.day)
              : "\u00a0"}
          </span>
        ))}
      </div>
    </div>
  );
}

export function OpsFunnel({
  steps,
  insight,
  compact = false,
}: {
  steps: OpsFunnelStepStat[];
  insight: OpsFunnelInsight;
  compact?: boolean;
}) {
  const max = Math.max(1, steps[0]?.count ?? 1);

  return (
    <div>
      {!compact && insight.worstDropped > 0 ? (
        <p className="mb-4 rounded-xl border-[3px] border-ink bg-hot-pink px-3 py-2 text-sm font-bold text-white">
          Fuite max : {insight.worstFrom} → {insight.worstTo}
          <span className="ml-2">
            −{insight.worstDropped} ({insight.worstDropRate}%)
          </span>
        </p>
      ) : null}
      <ul className={compact ? "space-y-2" : "space-y-3"}>
        {steps.map((step, index) => {
          const worst = index === insight.worstIndex && insight.worstDropped > 0;
          return (
            <li key={`${step.id}-${index}`}>
              {index > 0 ? (
                <p
                  className={`mb-1 text-xs font-bold ${
                    worst ? "text-hot-pink" : "text-ink/45"
                  }`}
                >
                  −{step.dropped} ({step.dropRate}%)
                  {step.skip > 0 ? ` · +${step.skip} hors étape préc.` : ""}
                </p>
              ) : null}
              <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm font-bold">
                <span className={worst ? "text-hot-pink" : "text-ink/60"}>
                  {step.label}
                </span>
                <span>
                  {step.count}
                  <span className="ml-2 text-ink/45">
                    {index === 0
                      ? "100%"
                      : `${step.ofPrevious}% préc. · ${step.ofTotal}% vis.`}
                  </span>
                </span>
              </div>
              <div className="mt-1 h-3 overflow-hidden rounded-pill border-[2px] border-ink bg-white">
                <div
                  className={`h-full ${worst ? "bg-hot-pink" : "bg-acid-yellow"}`}
                  style={{ width: `${(step.count / max) * 100}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
      <p className={`font-bold ${compact ? "mt-3 text-xs" : "mt-4 text-sm"}`}>
        Conv. : {insight.visitorToOrder}%
        {!compact ? (
          <span className="ml-2 text-ink/45">
            panier {insight.visitorToCart}% · checkout {insight.checkoutToOrder}%
          </span>
        ) : (
          <span className="ml-2 text-ink/45">
            fuite {insight.worstFrom} → {insight.worstTo} ({insight.worstDropRate}%)
          </span>
        )}
      </p>
      {!compact && insight.cartWithoutCompose > 0 ? (
        <p className="mt-1 text-xs font-bold text-ink/45">
          {insight.cartWithoutCompose} paniers sans passer par compose (fiche
          / mystery).
        </p>
      ) : null}
    </div>
  );
}
