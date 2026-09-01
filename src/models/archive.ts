export type ArchiveWave = "italian" | "indonesian" | "international";

export type ArchiveTag = "animal" | "food" | "machine";

export type ArchiveStickerTone =
  | "pink"
  | "cyan"
  | "green"
  | "orange"
  | "violet"
  | "yellow"
  | "blue";

export interface ArchiveFactSheet {
  type: string;
  appearance: string;
  platform: string;
  period: string;
  geographicOrigin: string;
  brainrotFamily: string;
  officialCanon: string;
}

export interface ArchiveRelatedLink {
  slug: string;
  reason: string;
}

export interface ArchiveVideo {
  platform: "tiktok";
  url: string;
  videoId: string;
  creator: string;
}

export interface ArchiveCharacter {
  slug: string;
  name: string;
  seoTitle: string;
  seoDescription: string;
  tagline: string;
  summary: string;
  appearance: string[];
  whyBrainrot: string[];
  documented: string[];
  uncertain: string[];
  communityLore: string[];
  relatedLinks: ArchiveRelatedLink[];
  brainrototoDisclaimer: string;
  factSheet: ArchiveFactSheet;
  wave: ArchiveWave;
  tags: ArchiveTag[];
  relatedOriginalIds: string[];
  stickerTone: ArchiveStickerTone;
  image: string;
  video?: ArchiveVideo;
}

export interface ArchiveArticleSection {
  heading: string;
  paragraphs: string[];
}

export type ArchiveArticleKind = "standard" | "family-tree";

export interface ArchiveArticle {
  slug: string;
  kind: ArchiveArticleKind;
  title: string;
  tagline: string;
  seoTitle: string;
  seoDescription: string;
  kicker: string;
  lead: string;
  image: string;
  imageAlt: string;
  sections: ArchiveArticleSection[];
  relatedCharacterSlugs: string[];
  relatedArticleSlugs: string[];
}

export interface ArchiveFamilyNode {
  id: string;
  name: string;
  slug?: string;
}

export interface ArchiveFamilyEdge {
  from: string;
  to: string;
  label: string;
}

export type ArchiveFamilyCluster =
  | { kind: "chain"; title: string; nodes: string[] }
  | { kind: "fork"; title: string; hub: string; children: string[] };

export interface ArchiveFamilyTree {
  disclaimer: string;
  nodes: ArchiveFamilyNode[];
  edges: ArchiveFamilyEdge[];
  clusters: ArchiveFamilyCluster[];
}
