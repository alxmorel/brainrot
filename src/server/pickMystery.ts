import { randomInt } from "node:crypto";
import { mysteryPool } from "@/data/mystery";
import type { Brainrototo } from "@/models";

function shuffled<T>(items: readonly T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    const current = next[i];
    const swap = next[j];
    if (current === undefined || swap === undefined) continue;
    next[i] = swap;
    next[j] = current;
  }
  return next;
}

export function pickMysteryBrainrots(qty: number): Brainrototo[] {
  const pool = mysteryPool();
  if (pool.length === 0 || qty < 1) return [];
  const out: Brainrototo[] = [];
  let deck = shuffled(pool);
  let cursor = 0;
  for (let n = 0; n < qty; n++) {
    if (cursor >= deck.length) {
      deck = shuffled(pool);
      cursor = 0;
    }
    const pick = deck[cursor];
    if (!pick) break;
    out.push(pick);
    cursor += 1;
  }
  return out;
}
