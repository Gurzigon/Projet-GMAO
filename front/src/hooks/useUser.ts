import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import userService from "../services/user.service";
import type { AddUserPreventiveResponse, IUser, IUserIntervention } from "../types/IUser";


// Récupérer les utilisateurs d'une intervention
export function useInterventionsWithUser(interventionId: number) {
  return useQuery<IUserIntervention[], Error>({
    queryKey: ['usersIntervention', interventionId],
    queryFn: async ({ queryKey }) => {
      const [, id] = queryKey;
      return userService.getAllUsersByIntervention(id as number);
    },
     enabled: interventionId !== null,
  });
};

// Récupérer les utilisateurs 
export function useUsers() {
  return useQuery<IUser[], Error>({
    queryKey: ['users'],
    queryFn: async () => {      
      return userService.getAllUsers();
    },
    
  });
};

// Ajouter un utilisateur à une intervention
export function useAddUserToIntervention() {
  return useMutation<
    IUserIntervention[], 
    Error,                
    { interventionId: number; validationCode: number } 
  >({
    mutationFn: ({ interventionId, validationCode }) =>
      userService.addUsertoIntervention(interventionId, validationCode),
  });
};

// Ajouter un utilisateur à un préventif
export function useAddUserToPreventive() {
  return useMutation<
    AddUserPreventiveResponse, 
    Error, // type d'erreur
    { preventiveId: number; validationCode: number } 
  >({
    mutationFn: ({ preventiveId, validationCode }) =>
      userService.addUsertoPreventive(preventiveId, validationCode),
  });
}
// // Login utilisateur
// export function useLogin() {

//   const navigate = useNavigate();
//   const [, setAuth] = useAtom(authAtom);
//   return useMutation({

//     mutationFn: (data: ILogin) => userService.login(data),

//     onSuccess: (user) => {
//       console.log("Connexion réussie :", user);
//       setAuth(user);
//       localStorage.setItem("user", JSON.stringify(user));      
//       navigate("/accueil");
//     },
//     onError: (error) => {
//       console.error("Erreur de connexion :", error);
//     }

//   });
// }

// Créer un nouvel utilisateur
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation<IUser, Error, Partial<IUser>>({
    mutationFn: (newUser) => userService.createUser(newUser),

    onSuccess: (createdUser) => {
      queryClient.setQueryData<IUser[]>(['users'], (oldUsers) => {
        if (!oldUsers) return [createdUser];
        return [...oldUsers, createdUser];
      });
    },
  });
}

// Modifier un utilisateur
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation<
    IUser, 
    Error, 
    { userId: number; updatedFields: Partial<IUser> }
  >({
    mutationFn: ({ userId, updatedFields }) => 
      userService.updateUser(userId, updatedFields),    
    
    onSuccess: (updatedUser) => {
      queryClient.setQueryData<IUser[]>(['users'], (oldUsers) => {
        if (!oldUsers) return [updatedUser];
        return oldUsers.map(user => user.id === updatedUser.id ? updatedUser : user);
      });
    },
  });
}

// Supprimer un utilisateur
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation<
    { message: string },
    Error, 
    number 
  >({
    mutationFn: (userId) => userService.deleteUser(userId),

    onSuccess: (_data, userId) => {      
      queryClient.setQueryData<IUser[]>(['users'], (oldUsers) => {
        if (!oldUsers) return [];
        return oldUsers.filter(user => user.id !== userId);
      });
    },
  });
}
