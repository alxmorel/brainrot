import { CheckoutPage } from "@/features/cart/CheckoutPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Commande — Brainrototo.com",
};

export default function Page() {
  return <CheckoutPage />;
}
