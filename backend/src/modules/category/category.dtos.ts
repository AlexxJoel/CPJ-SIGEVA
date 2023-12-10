export type Category = {
    id?: number;
    name: String;
    description?: String;
    status?: boolean
}

export type GetCategoryDto = Category;

export type SaveCategoryDto = Omit<Category, 'id'>;

export type UpdateCategoryDto = Category;