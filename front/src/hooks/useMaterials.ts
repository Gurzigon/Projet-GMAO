import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import materialService from "../services/material.service";
import type {  IStoreMaterial, IUpdateMaterial } from "../types/Imaterial";

const materialKeys = {
  all: ["materials"] as const,
  store: ['materials', 'store'] as const,
};

// Récupérer tous les matériels
export function useMaterials() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['materials'],
    queryFn: materialService.getAllMaterials,
  });

  useEffect(() => {
    if (query.isSuccess) {
      queryClient.invalidateQueries({ queryKey: materialKeys.all });
    }
  }, [query.isSuccess, queryClient]);

  return query;
}

// Récupérer toutes les matériels
export function useAllMaterials() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['materials'],
    queryFn: materialService.getMaterials,
  });

  useEffect(() => {
    if (query.isSuccess) {
      queryClient.invalidateQueries({ queryKey: materialKeys.all });
    }
  }, [query.isSuccess, queryClient]);

  return query;
}

// Récupérer un matériel par ID
export function useMaterialById(id: number | null): IUpdateMaterial | null {
  const { data } = useAllMaterials();
  if (!data || id === null) return null;

  const material = data.find((m) => m.id === id);
  return material ?? null;
}

// Supprimer un matériel
export function useDeleteMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => materialService.deleteMaterial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialKeys.all });
    },
    onError: (error: unknown) => {
      console.error("Erreur lors de la suppression :", error);
    },
  });
}

// Création d'un matériel
export function useCreateMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: materialService.createMaterial,
    onSuccess: () => {      
      queryClient.invalidateQueries({ queryKey: materialKeys.all });
    },
  });  
}

// Récupérer toutes les matériels du MAGASIN
export function useStoreMaterials() {
  return useQuery<IStoreMaterial[]>({
    queryKey: materialKeys.store, 
    queryFn: materialService.getStoreMaterials,    
  });
}

// Modifier un matériel MAGASIN
export const useUpdateMaterialStore = () => {
  return useMutation({
    mutationFn: (updateMaterialStore: IStoreMaterial) =>
      materialService.updateMaterialStore(updateMaterialStore),
  });
};

// Modifier un matériel
export const useUpdateMaterial = () => {
  return useMutation({
    mutationFn: (updatedMaterial: IUpdateMaterial) =>
      materialService.updateMaterial(updatedMaterial),
  });
};