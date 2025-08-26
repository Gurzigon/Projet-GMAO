import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import categoryService from "../services/category.service";
import type { ICategory, ICategoryFormData } from "../types/ICategory";
import api from "../utils/axios";

const categoryKeys = {
  all: ["category"] as const,
};

// Récupérer toutes les catégories
export function useCategory() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['category'],
    queryFn: categoryService.getAllCategories,
  });

  useEffect(() => {
    if (query.isSuccess) {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    }
  }, [query.isSuccess, queryClient]);

  return query;
};

// Créer une catégorie
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (category: ICategoryFormData & { serviceId: number }) => {
      const response = await api.post("/categories", category);
      return response.data as ICategory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
    onError: (error) => {
      console.error("Erreur lors de la création de la catégorie :", error);
    },
  });
}

// Modifier une catégorie
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: ICategoryFormData & { serviceId: number };
    }) => {
      return await categoryService.updateCategory(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour de la catégorie :", error);
    },
  });
}

// Supprimer une catégorie
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryService.deleteCategory, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}