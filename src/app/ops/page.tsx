import { OpsOrders } from "@/features/ops/OpsOrders";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Ops commandes — Brainrot" };

export default function Page() {
  return <OpsOrders />;
}
