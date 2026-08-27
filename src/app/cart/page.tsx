import { CartPage } from "@/features/cart/CartPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panier",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <CartPage />;
}
