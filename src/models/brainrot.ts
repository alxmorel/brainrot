export type Rarity = "common" | "rare" | "epic" | "legendary";

export interface BrainrotColorAssets {
  mockup: string;
  gallery: string[];
}

export interface Brainrototo {
  id: string;
  name: string;
  animal: string;
  ingredient: string;
  vibe: string;
  image: string;
  mockup?: string;
  gallery?: string[];
  colors?: Partial<Record<string, BrainrotColorAssets>>;
  rarity?: Rarity;
}
