import type { Brainrototo } from "@/models";

export function filterBrainrots(
  items: Brainrototo[],
  filters: {
    animal: string | null;
    ingredient: string | null;
    vibe: string | null;
  },
): Brainrototo[] {
  return items.filter((item) => {
    if (filters.animal && item.animal !== filters.animal) return false;
    if (filters.ingredient && item.ingredient !== filters.ingredient) {
      return false;
    }
    if (filters.vibe && item.vibe !== filters.vibe) return false;
    return true;
  });
}
