import type { IService } from "../types/IService";
import api from "../utils/axios";

const serviceService = {
    // Récupérer tous les services     
    async getAllServices() {
        const serviceResponse = await api.get("/services")
        return serviceResponse.data as IService[]
    } ,
};

export default serviceService