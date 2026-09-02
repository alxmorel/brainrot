import type { Product } from "@/models";

const tshirt: Product = {
  id: "tee-classic",
  type: "tshirt",
  name: "T-shirt bio unisexe",
  baseImage: "/assets/products/tshirt-base.svg",
};

const mysteryTee: Product = {
  id: "tee-mystery",
  type: "tshirt",
  name: "Mystery Tee",
  baseImage: "/assets/products/tshirt-base.svg",
};

export const products: Product[] = [tshirt, mysteryTee];

export const defaultProduct = tshirt;
export const mysteryProduct = mysteryTee;
