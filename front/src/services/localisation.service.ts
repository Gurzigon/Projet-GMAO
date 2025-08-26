import type { ILocalisation } from "../types/ILocalisation";
import api from '../utils/axios';

const localisationService = {
    //Récupérer toutes les localisations 
    async getAllLocalisations() {
        const localisationResponse = await api.get("/localisations")
        return localisationResponse.data as ILocalisation[]
    },

     // Créer une nouvelle localisation
    async createLocalisation({label} : {label: string}) {
        const localisationResponse = await api.post("/localisations", { label });
        return localisationResponse.data as ILocalisation;
    },
};

export default localisationService;