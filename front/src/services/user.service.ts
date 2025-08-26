/** biome-ignore-all lint/correctness/noUnusedVariables: <linter capricieux> */
/** biome-ignore-all lint/suspicious/noExplicitAny: <linter capricieux> */
import type { AddUserPreventiveResponse, IAuthUser, ILogin, IUser, IUserIntervention} from "../types/IUser";
import api from '../utils/axios';

const userService = {
  // Login
   async login(data: ILogin): Promise<{ user: IAuthUser; token: string }> {       
    // Je récupère le payload complet { user, token }
    const { data: payload }: { data: { user: IUser; token: string } } = await api.post("/auth/login", data, {
        withCredentials: true,
    });
    // Supprimer le mot de passe pour sécurité
    const { password, ...safeUser } = payload.user;
    // Retourner l'utilisateur safe et le token
    return { user: safeUser as IAuthUser, token: payload.token };
  },

    // Récupérer l'utilisateur en cours
    async  getCurrentUser(): Promise<IAuthUser> {  
    const { data: user }: { data: IUser } = await api.get("/auth/me")
    const { password, ...safeUser } = user
    return safeUser as IAuthUser
    },

    // Récupérer tous les utilisateurs du service
    async  getAllUsers(): Promise<IUser[]> {  
    const { data }: { data: IUser[] } = await api.get("/users");   
    return data
    },

    // Récupérer tous les utilisateurs d'une intervention
    async  getAllUsersByIntervention(interventionId: number): Promise<IUserIntervention[]> {  
    const { data }: { data: IUserIntervention[] } = await api.get(`/users/intervention/${interventionId}`);   
    return data
    },

    // Ajouter un utilisateur à une intervention
    async addUsertoIntervention(interventionId: number,  validationCode: number) : Promise<IUserIntervention[]> {
      const {data} : {data: IUserIntervention[] } = await api.post(`/users/intervention/${interventionId}`, {validationCode});
      return data
    } ,

    // Ajouter un utilisateur à un préventif
    async addUsertoPreventive(
      preventiveId: number,
      validationCode: number
    ): Promise<AddUserPreventiveResponse> {
      const { data }: { data: AddUserPreventiveResponse } = await api.post(
        `/users/preventive/${preventiveId}`,
        { validationCode }
      );
      return data;
    },

    // Créer un nouvel utilisateur
    async createUser(newUser: Partial<IUser>): Promise<IUser> {
      try {        
        const { data }: { data: IUser } = await api.post("/users", newUser, {
          withCredentials: true,
        });
        // Je retourne directement l'utilisateur complet créé
        return data;      
      } catch (error: any) {
        console.error("Erreur lors de la création de l'utilisateur", error);
        throw new Error(error.response?.data?.message || "Erreur inconnue");
      }
        },
        
    // Modifier un utilisateur
    async updateUser(userId: number, updatedFields: Partial<IUser>): Promise<IUser> {    
      const { data }: { data: IUser } = await api.put(`/users/${userId}`, updatedFields);
      return data;
    },

    // Logout utilisateur
    async logout(): Promise<boolean> {
      try {       
          await api.post("/auth/logout", {}, { withCredentials: true });                 
           return true;
          } catch (err: any) {
              console.error("Erreur lors de la déconnexion :", err.message);
              throw err;
          }
    },

    // Supprimer un utilisateur
    async deleteUser(userId: number): Promise<{ message: string }> {
      try {
        const { data }: { data: { message: string } } = await api.delete(`/users/${userId}`);
        return data;       
      } catch (error: any) {
        console.error("Erreur lors de la suppression de l'utilisateur", error);
        throw new Error(error.response?.data?.message || "Erreur inconnue");
      }
    },
};

export default userService