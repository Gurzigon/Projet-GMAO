import type { ICategory } from "../types/ICategory";
import api from '../utils/axios';

const categoryService = {
    //Récupérer toutes les cétgories 
    async getAllCategories() {
        const categoryResponse = await api.get("/categories")
        return categoryResponse.data as ICategory[]
    } ,

    // Créer une catégorie
    async createCategory({label, serviceId} : {label: string, serviceId: number}){
        const categoryResponse = await api.post("/categories", {label, serviceId})
        return categoryResponse.data as ICategory
    },

    // Supprimer une catégorie
    async deleteCategory(id: number) {
        const response = await api.delete(`/categories/${id}`);
        return response.data;
    },

    // Modifier une catégorie
    async updateCategory(id: number, { label, serviceId }: { label: string; serviceId: number }) {
        const categoryResponse = await api.put(`/categories/${id}`, { label, serviceId });
        return categoryResponse.data as ICategory;
    },
};

export default categoryService;