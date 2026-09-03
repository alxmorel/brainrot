import type { OpsFunnelInsight, OpsFunnelSlice, OpsFunnelStepStat } from "@/models";
import {
  DEVICE_LABEL,
  firstAttr,
  groupByVisitor,
  sourceOf,
  type AudienceEvent,
} from "@/server/ops/audience";

const STEPS: {
  id: string;
  label: string;
  match: (names: Set<string>, paths: Set<string>) => boolean;
}[] = [
  {
    id: "visitors",
    label: "Visiteurs",
    match: (names) => names.has("page_view") || names.size > 0,
  },
  {
    id: "compose",
    label: "Compose",
    match: (names, paths) =>
      names.has("view_create") ||
      names.has("trait_select") ||
      names.has("cta_composer") ||
      [...paths].some((path) => path === "/create" || path.startsWith("/create/")),
  },
  {
    id: "select",
    label: "Créature",
    match: (names) => names.has("brainrot_select") || names.has("preview_open"),
  },
  {
    id: "cart",
    label: "Panier",
    match: (names) => names.has("add_to_cart"),
  },
  {
    id: "checkout",
    label: "Checkout",
    match: (names) => names.has("begin_checkout"),
  },
  {
    id: "order",
    label: "Commande",
    match: (names) => names.has("order_placed"),
  },
];

function pct(n: number, d: number) {
  if (d <= 0) return 0;
  return Math.min(100, Math.round((n / d) * 100));
}

function visitorBags(events: AudienceEvent[]) {
  const map = new Map<string, { names: Set<string>; paths: Set<string> }>();
  const errorSids = new Set<string>();
  for (const event of events) {
    let current = map.get(event.sessionId);
    if (!current) {
      current = { names: new Set(), paths: new Set() };
      map.set(event.sessionId, current);
    }
    current.names.add(event.name);
    if (event.path) current.paths.add(event.path);
    if (event.name === "checkout_error") errorSids.add(event.sessionId);
  }
  return { map, errorSids };
}

function matchedIds(
  bags: Map<string, { names: Set<string>; paths: Set<string> }>,
  match: (names: Set<string>, paths: Set<string>) => boolean,
) {
  const ids = new Set<string>();
  for (const [id, value] of bags) {
    if (match(value.names, value.paths)) ids.add(id);
  }
  return ids;
}

function intersect(a: Set<string>, b: Set<string>) {
  const out = new Set<string>();
  for (const id of a) {
    if (b.has(id)) out.add(id);
  }
  return out;
}

function funnelFromReached(
  rows: { id: string; label: string; ids: Set<string> }[],
  errorSids: Set<string>,
): { steps: OpsFunnelStepStat[]; insight: OpsFunnelInsight } {
  const visitors = rows[0]?.ids.size ?? 0;
  const steps: OpsFunnelStepStat[] = rows.map((row, index) => {
    const count = row.ids.size;
    if (index === 0) {
      return {
        id: row.id,
        label: row.label,
        count,
        ofTotal: visitors > 0 ? 100 : 0,
        ofPrevious: visitors > 0 ? 100 : 0,
        dropped: 0,
        dropRate: 0,
        skip: 0,
      };
    }
    const prev = rows[index - 1]!.ids;
    let fromPrev = 0;
    for (const id of row.ids) {
      if (prev.has(id)) fromPrev += 1;
    }
    const dropped = prev.size - fromPrev;
    return {
      id: row.id,
      label: row.label,
      count,
      ofTotal: pct(count, visitors),
      ofPrevious: pct(fromPrev, prev.size),
      dropped,
      dropRate: pct(dropped, prev.size),
      skip: count - fromPrev,
    };
  });

  let worstIndex = Math.min(1, Math.max(0, steps.length - 1));
  for (let i = 2; i < steps.length; i += 1) {
    const current = steps[i]!;
    const worst = steps[worstIndex]!;
    if (
      current.dropRate > worst.dropRate ||
      (current.dropRate === worst.dropRate && current.dropped > worst.dropped)
    ) {
      worstIndex = i;
    }
  }

  const first = rows[0]?.ids ?? new Set<string>();
  const compose = rows.find((row) => row.id === "compose")?.ids ?? new Set<string>();
  const cart = rows.find((row) => row.id === "cart")?.ids ?? new Set<string>();
  const checkout = rows.find((row) => row.id === "checkout")?.ids ?? new Set<string>();
  const order = rows.find((row) => row.id === "order")?.ids ?? new Set<string>();
  const worst = steps[worstIndex];

  return {
    steps,
    insight: {
      worstIndex,
      worstFrom: rows[worstIndex - 1]?.label ?? "",
      worstTo: rows[worstIndex]?.label ?? "",
      worstDropped: worst?.dropped ?? 0,
      worstDropRate: worst?.dropRate ?? 0,
      visitorToOrder: pct(order.size, first.size),
      visitorToCart: pct(cart.size, first.size),
      cartToOrder: pct(order.size, cart.size),
      checkoutToOrder: pct(order.size, checkout.size),
      abandonedCart: [...cart].filter((id) => !checkout.has(id)).length,
      abandonedCheckout: [...checkout].filter((id) => !order.has(id)).length,
      checkoutErrors: [...errorSids].filter((id) => first.has(id)).length,
      cartWithoutCompose: [...cart].filter((id) => !compose.has(id)).length,
      rpvCents: 0,
    },
  };
}

export function buildFunnel(events: AudienceEvent[]): {
  steps: OpsFunnelStepStat[];
  insight: OpsFunnelInsight;
} {
  const { map, errorSids } = visitorBags(events);
  const reached = STEPS.map((step) => ({
    id: step.id,
    label: step.label,
    ids: matchedIds(map, step.match),
  }));
  return funnelFromReached(reached, errorSids);
}

function eventsFor(events: AudienceEvent[], ids: Set<string>) {
  if (ids.size === 0) return [];
  return events.filter((event) => ids.has(event.sessionId));
}

function sliceOf(label: string, ids: Set<string>, events: AudienceEvent[]): OpsFunnelSlice | null {
  if (ids.size === 0) return null;
  const { steps, insight } = buildFunnel(eventsFor(events, ids));
  return { label, steps, insight };
}

function nestedPath(
  label: string,
  start: Set<string>,
  cart: Set<string>,
  checkout: Set<string>,
  order: Set<string>,
  extra: { id: string; label: string; ids: Set<string> }[],
  errorSids: Set<string>,
): OpsFunnelSlice | null {
  if (start.size === 0) return null;
  const rows = [
    { id: "visitors", label, ids: start },
    ...extra.map((row) => ({
      ...row,
      ids: intersect(start, row.ids),
    })),
    { id: "cart", label: "Panier", ids: intersect(start, cart) },
    { id: "checkout", label: "Checkout", ids: intersect(start, checkout) },
    { id: "order", label: "Commande", ids: intersect(start, order) },
  ];
  const { steps, insight } = funnelFromReached(rows, errorSids);
  return { label, steps, insight };
}

export function buildFunnelBreakdown(events: AudienceEvent[]): {
  devices: OpsFunnelSlice[];
  sources: OpsFunnelSlice[];
  paths: OpsFunnelSlice[];
} {
  const perVisitor = groupByVisitor(events);
  const { map, errorSids } = visitorBags(events);
  const byDevice = new Map<string, Set<string>>();
  const bySource = new Map<string, Set<string>>();

  for (const [sessionId, list] of perVisitor) {
    const deviceRaw = firstAttr(list, "device");
    const device = deviceRaw ? (DEVICE_LABEL[deviceRaw] ?? deviceRaw) : "Inconnu";
    const source = sourceOf(list);
    let deviceSet = byDevice.get(device);
    if (!deviceSet) {
      deviceSet = new Set();
      byDevice.set(device, deviceSet);
    }
    deviceSet.add(sessionId);
    let sourceSet = bySource.get(source);
    if (!sourceSet) {
      sourceSet = new Set();
      bySource.set(source, sourceSet);
    }
    sourceSet.add(sessionId);
  }

  const deviceOrder = ["Mobile", "Ordinateur", "Tablette", "Inconnu"];
  const devices = deviceOrder
    .map((label) => {
      const ids = byDevice.get(label);
      return ids ? sliceOf(label, ids, events) : null;
    })
    .filter((row): row is OpsFunnelSlice => row !== null);

  const sources = [...bySource.entries()]
    .sort((a, b) => b[1].size - a[1].size)
    .slice(0, 6)
    .map(([label, ids]) => sliceOf(label, ids, events))
    .filter((row): row is OpsFunnelSlice => row !== null);

  const compose = matchedIds(map, STEPS[1]!.match);
  const select = matchedIds(map, STEPS[2]!.match);
  const cart = matchedIds(map, STEPS[3]!.match);
  const checkout = matchedIds(map, STEPS[4]!.match);
  const order = matchedIds(map, STEPS[5]!.match);

  const tee = new Set<string>();
  const mystery = new Set<string>();
  for (const [id, bag] of map) {
    for (const path of bag.paths) {
      if (path === "/tee" || path.startsWith("/tee/")) tee.add(id);
      if (path === "/mystery" || path.startsWith("/mystery/")) mystery.add(id);
    }
  }

  const paths = [
    nestedPath(
      "Compose",
      compose,
      cart,
      checkout,
      order,
      [{ id: "select", label: "Créature", ids: select }],
      errorSids,
    ),
    nestedPath("Fiche tee", tee, cart, checkout, order, [], errorSids),
    nestedPath("Mystery", mystery, cart, checkout, order, [], errorSids),
  ].filter((row): row is OpsFunnelSlice => row !== null);

  return { devices, sources, paths };
}
