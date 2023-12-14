import type { ProductSold } from "@/modules/product/dto/productSold.Dto";

export type Restock = {
  totalAmount: number;
  staffId: number;
  supplierInfo: {
    contact: string;
    person: {
      name: string;
      surname: string;
      lastname: string;
    };
  };
  charge: Array<ProductSold>;
  sendEmail: boolean;
};
