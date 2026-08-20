import { OpsOrders } from "@/features/ops/OpsOrders";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Ops commandes — Brainrototo" };

export default function Page() {
  return <OpsOrders />;
}
