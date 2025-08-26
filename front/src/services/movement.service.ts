import type { IMovement } from "../types/IMovement";
import api from '../utils/axios';

const movementService = {
    //Récupérer tous les movements 
    async getAllmovements() {
        const movementsResponse = await api.get("/movements")
        return movementsResponse.data as IMovement[]
    } ,

    async createStockIn(materialId: number, quantity: number) {
        const movementsResponse = await api.post("/movements/in", { materialId, quantity})
        return movementsResponse.data as IMovement
    },

    async createStockOut(materialId: number, quantity: number) {
        const movementsResponse = await api.post("/movements/out", { materialId, quantity})
        return movementsResponse.data as IMovement
    }
};

export default movementService;