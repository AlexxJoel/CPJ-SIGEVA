import api from "../../config/http-client.gateway";
import type {Category} from "@/modules/category/dto/category.Dto";

export class CategoryController {

    static async getAllCategories(setLoading: Function) {
        try {
            setLoading(true);
            const response = await api.doGet("/pageable/category");
            return response.data.data;
        } catch (error) {
            console.log("soy el erro", error);
        }finally {
            setLoading(false);
        }
    }

    static async changeStatus(cardId: number){
        try {
            const response = await api.doDelete(`/category/${cardId}`);
            return response.data.data;
        } catch (error) {
            console.log("soy el erro", error);
        }
    }

    static async updateCategory(categoryId: number, payload: Category){
        try {
            const response = await api.doPut(`/category/`, {
                id: categoryId,
                name: payload.name,
                description: payload.description
            });
            return response.data.data;
        } catch (error) {
            console.log("soy el erro", error);
        }
    }
}