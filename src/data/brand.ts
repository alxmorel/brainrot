import type { Rarity } from "@/models";

/** Identité commerciale - source unique du copy de marque. */
export const brand = {
  name: "Brainrototo",
  line: "Wear",
  tagline: "Compose. Porte. Collectionne.",
  series: "Série 01",
  hero: {
    lines: ["Des créatures", "Brainrototo", "qui se portent"] as const,
    kicker: "Animal × Food × vibe.",
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
      { id: "Food", label: "Food", hint: "Banane, pizza, fraise…", tone: "yellow" },
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
        text: "Animal, Food, vibe. Le Brainrototo apparaît.",
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
    lead: "Choisis ce que tu veux - génère quand tu veux.",
    filters: "Le combo",
    pick: "Compose ton combo puis génère",
    generate: "Générer",
    generateAgain: "Encore !",
    generating: "…",
    emptyCombo: "Aucun Brainrototo pour ce combo",
    emptyHint: "Change un trait du combo.",
  },
  product: {
    related: "Le reste de la bande",
    wear: "Le porter →",
    explore: "Explorer d’autres combos →",
  },
  mystery: {
    nav: "Mystery",
    name: "Mystery Tee",
    eyebrow: "Série 01",
    title: "Mystery Tee",
    pitch: "Un tee tiré au sort. La surprise, à l’ouverture.",
    lead: "Taille et couleur, à toi. Le visuel, dans la boîte.",
    legal: "Tirage définitif. Ni retour, ni échange.",
    cta: "Acheter →",
    add: "Ajouter au panier",
    pay: "Payer →",
    poolLabel: "Dans la collection",
    seoTitle: "Mystery Tee",
    seoDescription:
      "Mystery Tee Brainrototo : un visuel tiré au sort dans la Série 01, révélé à l’ouverture. Prix collector.",
  },
  footer: {
    line: "Des créatures Brainrototo. Qui se portent.",
  },
  notFound: {
    code: "404",
    lines: ["T’es", "perdu."] as const,
    lead: "Ce combo n’existe pas.",
    cta: "Composer le mien →",
  },
  archive: {
    nav: "Archive",
    eyebrow: "The Brainrot Archive",
    tagline: "Les persos TikTok, en bref.",
    indexTitle: "Les personnages",
    indexLead: "Les persos TikTok du brainrot, en fiches courtes.",
    blogNav: "Blog",
    blogTitle: "Le blog",
    blogLead: "C’est quoi le brainrot, les noms, les liens entre persos.",
    homeEyebrow: "The Brainrot Archive",
    homeTitle: "Les persos TikTok, en fiches.",
    homeLead: "Noms, clips, d’où ça vient.",
    homeCta: "L’archive →",
  },
  seo: {
    title: "Brainrototo | Site officiel - des créatures qui se portent",
    description:
      "Brainrototo est le site officiel de la marque Brainrototo. Compose une créature originale (animal × Food × vibe) et porte-la sur un tee bio. brainrototo.com",
    collectionTitle: "Compose ton Brainrototo",
    collectionDescription:
      "Compose un combo (animal × Food × vibe), génère ta créature Brainrototo, on l’imprime sur un tee.",
  },
} as const;

export const rarityLabel: Record<Rarity, string> = {
  common: "Commun",
  rare: "Rare",
  epic: "Épique",
  legendary: "Légendaire",
};
