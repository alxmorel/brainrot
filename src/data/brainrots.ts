import type { Brainrototo } from "@/models";
import { colorPack } from "@/data/productAssets";

const img = {
  croc: "/assets/brainrots/banana-croc.png",
  sloth: "/assets/brainrots/lemon-sloth.png",
  elephant: "/assets/brainrots/elephant-cactus.png",
  ananapollo: "/assets/brainrots/ananas-poulet-assassin.png",
  banachillo: "/assets/brainrots/banana-croc-chill.png",
  riccio: "/assets/brainrots/riccio-fragoloni.png",
  anatra: "/assets/brainrots/anatra-zuccarininio.png",
} as const;

const banacro = "/assets/products/banacrocodilo_bambino";
const lemonSloth = "/assets/products/lemon_sloth";

export const brainrots: Brainrototo[] = [
  {
    id: "banacrocodilo",
    name: "Banacrocodilo Bambino",
    animal: "crocodile",
    ingredient: "banane",
    vibe: "italian",
    image: img.croc,
    colors: {
      white: colorPack(banacro, "white"),
      "deep-black": colorPack(banacro, "deep-black"),
    },
    rarity: "legendary",
  },
  {
    id: "assassinpollo",
    name: "Pollo Ananasassasini",
    animal: "poulet",
    ingredient: "ananas",
    vibe: "assassin",
    image: img.ananapollo,
    rarity: "legendary",
  },
  {
    id: "banachillo",
    name: "Banachillo Crocodilo",
    animal: "crocodile",
    ingredient: "banane",
    vibe: "chill",
    image: img.banachillo,
    rarity: "epic",
  },
  {
    id: "riccio-fragoloni",
    name: "Riccio Fragoloni",
    animal: "herisson",
    ingredient: "fraise",
    vibe: "cute",
    image: img.riccio,
    rarity: "epic",
  },
  {
    id: "anatra-zuccarininio",
    name: "Anatra Zuccarininio",
    animal: "canard",
    ingredient: "citrouille",
    vibe: "cute",
    image: img.anatra,
    rarity: "epic",
  },
  { id: "crocopizza", name: "Crocopizza Chaos", animal: "crocodile", ingredient: "pizza", vibe: "chaotic", image: img.croc, rarity: "rare" },
  { id: "fragolafrogo", name: "Fragolafrogo", animal: "grenouille", ingredient: "fraise", vibe: "cute", image: img.sloth, mockup: `${lemonSloth}/editor_front.png`, gallery: [`${lemonSloth}/editor_front.png`, `${lemonSloth}/person1_front.png`, `${lemonSloth}/person1_profile-left.png`, `${lemonSloth}/person1_profile-right.png`, `${lemonSloth}/person1_back.png`, `${lemonSloth}/person2_front.png`], rarity: "epic" },
  { id: "melonsharko", name: "Melonsharko", animal: "requin", ingredient: "pasteque", vibe: "cursed", image: img.elephant, rarity: "rare" },
  { id: "ananasinge", name: "Ananasinge Deluxe", animal: "singe", ingredient: "ananas", vibe: "luxury", image: img.sloth, rarity: "epic" },
  { id: "duckpizza", name: "Duckpizza Cursed", animal: "canard", ingredient: "pizza", vibe: "cursed", image: img.elephant, rarity: "common" },
  { id: "chatbanane", name: "Chatbananino", animal: "chat", ingredient: "banane", vibe: "cute", image: img.sloth, rarity: "rare" },
  { id: "pommecroc", name: "Pommecrocodilo", animal: "crocodile", ingredient: "pomme", vibe: "italian", image: img.croc, rarity: "common" },
  { id: "requinfraise", name: "Fragolasharko", animal: "requin", ingredient: "fraise", vibe: "chaotic", image: img.elephant, rarity: "epic" },
  { id: "singepizza", name: "Pizzamunko Cute", animal: "singe", ingredient: "pizza", vibe: "cute", image: img.sloth, rarity: "common" },
  { id: "canardananas", name: "Ananaducko", animal: "canard", ingredient: "ananas", vibe: "italian", image: img.croc, rarity: "rare" },
  { id: "frogpasteque", name: "Melonfrogo Luxe", animal: "grenouille", ingredient: "pasteque", vibe: "luxury", image: img.elephant, rarity: "legendary" },
  { id: "chatpizza", name: "Pizzagatto Cursed", animal: "chat", ingredient: "pizza", vibe: "cursed", image: img.sloth, rarity: "rare" },
  { id: "crocopasteque", name: "Meloncroc Chaos", animal: "crocodile", ingredient: "pasteque", vibe: "chaotic", image: img.croc, rarity: "epic" },
  { id: "singefraise", name: "Fragolamunko", animal: "singe", ingredient: "fraise", vibe: "italian", image: img.sloth, rarity: "common" },
  { id: "requinbanane", name: "Bananasharko Luxe", animal: "requin", ingredient: "banane", vibe: "luxury", image: img.elephant, rarity: "rare" },
  { id: "canardpomme", name: "Pommduckino", animal: "canard", ingredient: "pomme", vibe: "cute", image: img.croc, rarity: "common" },
  { id: "frogpizza", name: "Pizzfrogo Chaos", animal: "grenouille", ingredient: "pizza", vibe: "chaotic", image: img.sloth, rarity: "rare" },
  { id: "chatananas", name: "Ananagatto Cursed", animal: "chat", ingredient: "ananas", vibe: "cursed", image: img.sloth, rarity: "epic" },
  { id: "crocfraise", name: "Fragolacroc Luxe", animal: "crocodile", ingredient: "fraise", vibe: "luxury", image: img.croc, rarity: "legendary" },
  { id: "requinpomme", name: "Pommsharko", animal: "requin", ingredient: "pomme", vibe: "italian", image: img.elephant, rarity: "common" },
  { id: "singepasteque", name: "Melonmunko Cursed", animal: "singe", ingredient: "pasteque", vibe: "cursed", image: img.sloth, rarity: "rare" },
  { id: "canardfraise", name: "Fragoladuck Chaos", animal: "canard", ingredient: "fraise", vibe: "chaotic", image: img.croc, rarity: "epic" },
  { id: "frogbanane", name: "Bananfrogo Cute", animal: "grenouille", ingredient: "banane", vibe: "cute", image: img.sloth, rarity: "common" },
];

/** Ordre éditorial tant qu’il n’y a pas assez de ventes. */
export const bestSellerFallbackIds = [
  "banacrocodilo",
  "assassinpollo",
  "banachillo",
  "riccio-fragoloni",
  "anatra-zuccarininio",
  "fragolafrogo",
  "melonsharko",
  "ananasinge",
  "crocfraise",
] as const;
