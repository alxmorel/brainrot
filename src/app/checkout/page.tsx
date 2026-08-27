import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Commande",
  robots: { index: false, follow: false },
};

export default function CheckoutRedirectPage() {
  redirect("/cart#paiement");
}
