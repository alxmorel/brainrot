import { teePriceLabel } from "@/data/pricing";

/** Identité légale — à compléter avant de vendre. Affichée telle quelle sur les pages. */
export const legal = {
  brand: "Brainrototo",
  siteName: "brainrototo.com",
  siteUrl: "https://brainrototo.com",
  publisherName: "Alexandre Morel",
  legalForm: "SARL",
  address: "167 rue sous marin casabianca, 83000, Toulon (France)",
  siret: "[SIRET — à compléter]",
  rcs: "[RCS Ville — à compléter, ou « non inscrit »]",
  vat: "[N° TVA ou « TVA non applicable, art. 293 B du CGI »]",
  email: "alexandre.morel69@gmail.com",
  phone: "+33 6 14 51 10 27",
  publicationDirector: "Alexandre Morel",
  host: {
    name: "Oracle Cloud Infrastructure",
    region: "EU-Marseille-1 (France)",
  },
  paymentProcessor: "Stripe Payments Europe, Ltd.",
  priceTtc: teePriceLabel,
  deliveryShort: "2–7 jours",
  deliveryEstimate:
    "2 à 7 jours ouvrés après paiement (France et UE, délai indicatif)",
  trackingFollowUp:
    "Tu recevras un second email dès que le transporteur aura un lien de suivi.",
};
