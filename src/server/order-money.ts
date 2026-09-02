import { teePriceCents } from "@/data/pricing";
import type { Order, OrderItem } from "@/models";

export function orderUnitCents(order: Pick<Order, "unitCents">) {
  return order.unitCents > 0 ? order.unitCents : teePriceCents;
}

export function orderLineCents(
  order: Pick<Order, "unitCents">,
  item: Pick<OrderItem, "quantity" | "unitCents">,
) {
  const unit = item.unitCents > 0 ? item.unitCents : orderUnitCents(order);
  return item.quantity * unit;
}

export function orderPaidTotal(
  order: Pick<Order, "items" | "unitCents" | "discountCents" | "totalCents">,
) {
  if (order.totalCents > 0) return order.totalCents;
  const subtotal = order.items.reduce(
    (sum, item) => sum + orderLineCents(order, item),
    0,
  );
  return Math.max(0, subtotal - (order.discountCents || 0));
}
