import { OrderConfirm } from "@/features/cart/OrderConfirm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Commande confirmée — Brainrot.com",
};

export default async function MerciPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  return <OrderConfirm orderId={id} />;
}
