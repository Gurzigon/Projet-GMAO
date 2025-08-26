import type {IMaterial, IMaterialFormData, IMaterialSearched, IStoreMaterial, IStoreMaterialFormData, IUpdateMaterial} from '../types/Imaterial';
import api from '../utils/axios';

const materialService = {
    //Récupérer toutes les matériels
    async getAllMaterials() {
        const interventionResponse = await api.get("/materials")
        return interventionResponse.data as IMaterialSearched[]
    } ,

     //Récupérer toutes les matériels
    async getMaterials() {
        const materialResponse = await api.get("/materials")
        return materialResponse.data as IMaterial[]
    } ,

    // Mettre à jour un matériel du MAGASIN
    async updateMaterialStore (material: IStoreMaterial) {
      const response = await api.put(`/materials`, material); 
      return response.data;
    },

    // Mettre à jour un matériel
    async updateMaterial(material: IUpdateMaterial) {
      const response = await api.put(`/materials`, material); 
      return response.data;
    },

    // Supprimer un matériel
    async deleteMaterial(id:number) {
      const response = await api.delete(`/materials/${id}`);
      return response.data
    },

    // Créer un matériel
    async createMaterial(material: IMaterialFormData){
      const response = await api.post(`/materials`, material);      
      return response.data as IMaterialFormData
    },

    // Créer un matériel MAGASIN
    async createMaterialStore(material: IStoreMaterialFormData){
      const response = await api.post(`/materials`, material);      
      return response.data as IStoreMaterialFormData
    },

    //Récupérer toutes les matériels MAGASIN
    async getStoreMaterials() {
        const storeMaterialResponse = await api.get<IStoreMaterial[]>("/materials/store")
        return storeMaterialResponse.data as IStoreMaterial[]
    },
};

export default materialService