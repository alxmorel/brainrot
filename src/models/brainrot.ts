export type Rarity = "common" | "rare" | "epic" | "legendary";

export interface Brainrototo {
  id: string;
  name: string;
  animal: string;
  ingredient: string;
  vibe: string;
  image: string;
  rarity?: Rarity;
}
