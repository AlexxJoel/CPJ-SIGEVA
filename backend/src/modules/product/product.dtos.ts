export type Product = {
    id?: number;
    name: String;
    description?: String;
    quantity: number;
    unitPrice: number;
    status?: boolean;
    categoriesId: number;
}

export type GetProductDto = Product & {
    category?: {
        id?: number;
        name?: String;
        description?: String;
    }
}

export type SaveProductDto = Omit<Product, 'id'>

export type UpdateProductDto = Product