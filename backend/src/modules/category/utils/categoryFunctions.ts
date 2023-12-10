import { GetCategoryDto } from "../category.dtos"

export const mapCategoriesResponse = (rows: any): GetCategoryDto[] => {
    return rows.map((row: any) => ({
        id: row['id'],
        name: row['name'],
        description: row['description'],
        status: row['status']
    }))
}