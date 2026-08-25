import type { Rarity } from "@/models";

/** Identité commerciale - source unique du copy de marque. */
export const brand = {
  name: "Brainrototo",
  line: "Wear",
  tagline: "Compose. Porte. Collectionne.",
  series: "Série 01",
  hero: {
    lines: ["Des créatures", "Brainrototo", "qui se portent"] as const,
    kicker: "Animal × bouffe × vibe.",
    pitch:
      "Pas un meme volé. Une créature originale, dessinée, imprimée sur un vrai tee.",
    cta: "Composer le mien →",
  },
  manifesto: {
    eyebrow: "La formule",
    title: "Un Brainrototo, c’est un combo.",
    body: "Le brainrot a une grammaire. On en a fait une bande - pas le requin Nike de TikTok.",
    traits: [
      { id: "animal", label: "Animal", hint: "Croc, requin, grenouille…", tone: "green" },
      { id: "bouffe", label: "Bouffe", hint: "Banane, pizza, fraise…", tone: "yellow" },
      { id: "vibe", label: "Vibe", hint: "Italian, cursed, luxe…", tone: "violet" },
    ],
    result: "Une créature. Un tee.",
  },
  gang: {
    eyebrow: "Série 01",
    title: "La bande",
    seeAll: "Toute la bande",
  },
  how: {
    eyebrow: "Comment ça marche",
    title: "Un combo. Une créature. Un tee.",
    steps: [
      {
        n: "01",
        title: "Compose un combo",
        text: "Animal, bouffe, vibe. Le Brainrototo apparaît.",
      },
      {
        n: "02",
        title: "Pick ta créature",
        text: "Une illu originale, un tee bio, un prix.",
      },
      {
        n: "03",
        title: "On imprime",
        text: "À la commande, chez toi en 2–7 jours.",
      },
    ],
    cta: "Composer le mien →",
  },
  collection: {
    title: "Compose ton Brainrototo",
    lead: "Animal, bouffe, vibe. Trouve ta créature - on l’imprime sur le tee.",
    filters: "Le combo",
    pick: "Choisis un Brainrototo",
  },
  product: {
    related: "Le reste de la bande",
    wear: "Le porter →",
    explore: "Explorer d’autres combos →",
  },
  footer: {
    line: "Des créatures brainrot. Qui se portent.",
  },
  seo: {
    title: "Brainrototo - Des créatures brainrot qui se portent",
    description:
      "Compose un combo (animal × bouffe × vibe), choisis ta créature originale, porte-la sur un tee bio. Collection officielle Brainrototo - pas un meme volé.",
    collectionTitle: "Compose ton Brainrototo",
    collectionDescription:
      "Animal, bouffe, vibe. Parcours la bande, pick ta créature, on l’imprime sur un tee.",
  },
} as const;

export const rarityLabel: Record<Rarity, string> = {
  common: "Commun",
  rare: "Rare",
  epic: "Épique",
  legendary: "Légendaire",
};
