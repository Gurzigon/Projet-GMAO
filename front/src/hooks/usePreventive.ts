import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import preventiveService from "../services/preventive.service";
import type { IUpdatePreventive } from "../types/IPreventive";

const preventiveKeys = {
  all: ["preventives"] as const,
};

// Création d'un entretien préventif
export function useCreatePreventive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: preventiveService.createPreventiveWithoutId,
    onSuccess: () => {       
      queryClient.invalidateQueries({ queryKey: preventiveKeys.all });
    },
    onError: (error) => {
      console.error("Erreur lors de la création du préventif :", error);
    },
  });  
};

// Récupérer toutes les préventifs
export function usePreventives() { 

   return useQuery({
    queryKey: ['preventives'],
    queryFn: preventiveService.getAllPreventives,
    staleTime: 0,
  });
};

// Supprimer un préventif
export function useDeletePreventive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => preventiveService.deletePreventive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: preventiveKeys.all });
    },
    onError: (error: unknown) => {
      console.error("Erreur lors de la suppression :", error);
    },
  });
};

// Modifier un préventif
export const useUpdatePreventive = () => {
  return useMutation({
    mutationFn: (updatePreventive: IUpdatePreventive) =>
      preventiveService.updatePreventive(updatePreventive),
  });
};

// Modifier le status d'un préventif
export const useUpdateStatusPreventive = () => {
  return useMutation({
    mutationFn: ({ id, statusId, validationCode }: { id: number; statusId: number, validationCode: number }) =>
      preventiveService.updateStatusPreventive(id, statusId, validationCode),
  });
};
