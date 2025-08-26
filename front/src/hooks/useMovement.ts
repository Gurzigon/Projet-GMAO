import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import movementService from "../services/movement.service";


// Récupérer tous les mouvements
export function useMovement() {
  return useQuery({
    queryKey: ['movement'],
    queryFn: movementService.getAllmovements,
  });
};

//Ajouter une entrée en stock
export function useCreateStockIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ materialId, quantity }: { materialId: number; quantity: number }) =>
      movementService.createStockIn(materialId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movement'] }); 
    },
  });
}

//Ajouter une sortie du stock
export function useCreateStockOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ materialId, quantity }: { materialId: number; quantity: number }) =>
      movementService.createStockOut(materialId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movement'] });
    },
  });
}