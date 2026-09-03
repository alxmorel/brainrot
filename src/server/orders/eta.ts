import { legal } from "@/data/legal";
import type { OrderStatus } from "@/models";

/** ETA indicative selon le statut — pas de date transporteur. */
export function orderEtaLabel(status: OrderStatus): string | null {
  if (
    status === "cancelled" ||
    status === "pending_payment" ||
    status === "delivered"
  ) {
    return null;
  }
  if (status === "shipped") return legal.etaAfterShip;
  return legal.etaBeforeShip;
}
