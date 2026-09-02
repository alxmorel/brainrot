import type { ArchiveTag, ArchiveWave } from "@/models";

export const archiveCopy = {
  summaryTitle: "C’est quoi ?",
  factsTitle: "Fiche",
  appearanceTitle: "À quoi ça ressemble",
  whyBrainrotTitle: "Pourquoi on en parle",
  documentedTitle: "Les faits",
  uncertainTitle: "On ne sait pas",
  loreTitle: "Les fans racontent",
  communityNote: "Fans",
  relatedTitle: "Souvent avec",
  brainrototoTitle: "Découvrir les créatures Brainrototo",
  composeCta: "Composer le mien →",
  articleCtaBody:
    "On ne vend pas ces persos TikTok. Compose une créature Brainrototo originale.",
  seeTee: "Voir le tee →",
  allCharacters: "Tous les personnages",
  allArticles: "Le blog",
  factLabels: {
    type: "Type",
    appearance: "Apparence",
    platform: "Plateforme",
    period: "Période",
    geographicOrigin: "Origine",
    brainrotFamily: "Famille",
    officialCanon: "Version officielle",
  },
  filters: {
    all: "Tous",
    italian: "Italian",
    indonesian: "Indonesian",
    international: "International",
    animal: "Animaux",
    food: "Food",
    machine: "Machines",
  } satisfies Record<"all" | ArchiveWave | ArchiveTag, string>,
  waveLabel: {
    italian: "Italian Brainrot",
    indonesian: "Indonésie",
    international: "Vague internationale",
  } satisfies Record<ArchiveWave, string>,
  emptyFilter: "Aucun personnage pour ce filtre.",
  familyTreeNote: "Certains liens viennent des clips d’origine. D’autres, des fans.",
  imageCredit:
    "Image : Wikimedia Commons. Documentaire — pas un produit Brainrototo.",
  videoTitle: "Clip",
  videoOpen: "Ouvrir sur TikTok →",
  videoNote: "Extrait TikTok d’un créateur tiers. Le son peut différer.",
  portraitLabel: "Portrait",
  clipLabel: "Clip",
} as const;

export const archiveFilters = [
  "all",
  "italian",
  "indonesian",
  "international",
  "animal",
  "food",
  "machine",
] as const;

export type ArchiveFilterId = (typeof archiveFilters)[number];
