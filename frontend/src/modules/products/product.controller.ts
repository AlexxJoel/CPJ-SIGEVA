import api from "../../config/http-client.gateway";
export class ProductController {


    static async getAllCategories() {
        try {
            const response = await api.doGet("/pageable/category");
            return response.data.data;
        } catch (error) {
            console.log("soy el erro", error);
        }
    }
}