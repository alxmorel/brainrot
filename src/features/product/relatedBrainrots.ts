import type { Brainrototo } from "@/models";

export function relatedBrainrots(
  current: Brainrototo,
  all: Brainrototo[],
  limit = 4,
): Brainrototo[] {
  return all
    .filter((item) => item.id !== current.id)
    .map((item) => ({
      item,
      score:
        (item.animal === current.animal ? 2 : 0) +
        (item.vibe === current.vibe ? 1 : 0) +
        (item.ingredient === current.ingredient ? 1 : 0),
    }))
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.item.name.localeCompare(b.item.name, "fr"),
    )
    .slice(0, limit)
    .map(({ item }) => item);
}
