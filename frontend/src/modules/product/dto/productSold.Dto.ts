import type { Product } from "./product.Dto";

export type ProductSold = Product & {
  index: number;
  quantitySold: number;
};
