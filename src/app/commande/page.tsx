import { OrderLookup } from "@/features/cart/OrderLookup";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ma commande",
  description: "Suivi de commande Brainrototo - statut et lien de suivi colis.",
  robots: { index: false, follow: false },
};

export default function CommandePage() {
  return <OrderLookup />;
}
