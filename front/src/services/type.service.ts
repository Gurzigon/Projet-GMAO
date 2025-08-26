import type { ICategory } from "../types/ICategory";
import api from '../utils/axios';

const typeService = {
    //Récupérer tous les types 
    async getAllTypes() {
        const typesResponse = await api.get("/types")
        return typesResponse.data as ICategory[]
    } ,
};

export default typeService;