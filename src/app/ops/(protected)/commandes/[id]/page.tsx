import { OpsOrderDetail } from "@/features/ops/OpsOrderDetail";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Ops - Commande" };

export default async function OpsOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <OpsOrderDetail orderId={id} />;
}
