import type { Category } from "@/modules/category/dto/category.Dto";

export type Product = {
    id: number;
    name: string;
    description: string;
    quantity: number;
    uniPrice: number;
    status: boolean;
    categoriesId: number;
    category: Category
}