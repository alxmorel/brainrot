import { OpsShopForm } from "@/features/ops/OpsShopForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Ops - Boutique" };

export default function OpsBoutiquePage() {
  return <OpsShopForm />;
}
