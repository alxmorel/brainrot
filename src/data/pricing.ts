export const teePriceCents = 2490;

export function formatEur(cents: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export const teePriceLabel = `${formatEur(teePriceCents)} TTC`;

export const shippingNote = "Livraison comprise";

export const customProductNote =
  "Tee imprimé à la commande : pas de rétractation de 14 jours.";
