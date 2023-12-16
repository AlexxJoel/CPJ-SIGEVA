import { GetProductDto } from "../product.dtos";

export const mapProductsResponse = (rows: any): GetProductDto[] => {
    return rows.map((row: any) => ({
        id: row['id'],
        name: 'prueba',
        description: row['description'],
        quantity: row['quantity'],
        uniPrice: row['unit_price'],
        status: row['status'],
        categoriesId: row['categories_id'],
        category: {
            id: row['categories_id'],
            name: row['category_name'],
            description: row['category_description'],
        }
    }));
}

export const validateUnitPrice = (numero: number): boolean =>  {
    // Expresión regular que valida que haya exactamente dos decimales
    const regex = /^\d+(\.\d{1,2})?$/;
    return regex.test(numero.toString());
}