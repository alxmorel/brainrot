export type Rarity = "common" | "rare" | "epic" | "legendary";

export interface Brainrot {
  id: string;
  name: string;
  animal: string;
  ingredient: string;
  vibe: string;
  image: string;
  rarity?: Rarity;
}
