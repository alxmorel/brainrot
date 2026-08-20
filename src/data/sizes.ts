export const teeSizes = ["XS", "S", "M", "L", "XL", "XXL"] as const;

export type TeeSize = (typeof teeSizes)[number];

export function isTeeSize(value: string): value is TeeSize {
  return (teeSizes as readonly string[]).includes(value);
}
