export type ProductType = "tshirt" | "hoodie" | "cap";

export interface Product {
  id: string;
  type: ProductType;
  name: string;
  baseImage: string;
}
