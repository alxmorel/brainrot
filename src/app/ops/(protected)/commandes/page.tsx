import { OpsOrdersList } from "@/features/ops/OpsOrdersList";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Ops - Commandes" };

export default function OpsCommandesPage() {
  return <OpsOrdersList />;
}
