import type { Product } from "@/models";

const tshirt: Product = {
  id: "tee-classic",
  type: "tshirt",
  name: "T-shirt bio unisexe",
  baseImage: "/assets/products/tshirt-base.svg",
};

export const products: Product[] = [tshirt];

export const defaultProduct = tshirt;
