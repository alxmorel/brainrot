import { bestSellerFallbackIds, brainrots } from "@/data/brainrots";
import { listBestSellingBrainrotIds } from "@/server/orders-repo";
import type { Brainrototo } from "@/models";

export async function getBestSellerBrainrots(limit = 8): Promise<Brainrototo[]> {
  let soldIds: string[] = [];
  try {
    soldIds = await listBestSellingBrainrotIds(limit);
  } catch {
    soldIds = [];
  }

  const merged = [
    ...soldIds,
    ...bestSellerFallbackIds.filter((id) => !soldIds.includes(id)),
  ].slice(0, limit);

  return merged
    .map((id) => brainrots.find((item) => item.id === id))
    .filter((item): item is Brainrototo => Boolean(item));
}
