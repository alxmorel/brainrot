export const teeColorIds = ["white", "deep-black"] as const;

export type TeeColorId = (typeof teeColorIds)[number];

export const defaultTeeColor: TeeColorId = "white";

export const teeColors: {
  id: TeeColorId;
  label: string;
  swatch: string;
  gelato: string;
}[] = [
  { id: "white", label: "Blanc", swatch: "#f4f1ea", gelato: "white" },
  { id: "deep-black", label: "Noir", swatch: "#111111", gelato: "deep-black" },
];

export function isTeeColor(value: string): value is TeeColorId {
  return (teeColorIds as readonly string[]).includes(value);
}

export function teeColorLabel(id: string): string {
  return teeColors.find((color) => color.id === id)?.label ?? id;
}
