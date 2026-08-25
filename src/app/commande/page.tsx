import { OrderLookup } from "@/features/cart/OrderLookup";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ma commande - Brainrototo.com",
  description: "Suivi de commande Brainrototo — statut et lien de suivi colis.",
};

export default function CommandePage() {
  return <OrderLookup />;
}
