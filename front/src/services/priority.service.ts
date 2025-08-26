import type { IPriority } from "../types/IPriority";
import api from '../utils/axios';

const priorityService = {
    //Récupérer toutes les localisations 
    async getAllPriority() {
        const priorityResponse = await api.get("/priorities")
        return priorityResponse.data as IPriority[]
    } ,
};

export default priorityService;