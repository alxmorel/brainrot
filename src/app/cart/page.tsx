import { CartPage } from "@/features/cart/CartPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panier — Brainrototo.com",
};

export default function Page() {
  return <CartPage />;
}
