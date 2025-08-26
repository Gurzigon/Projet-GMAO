import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import localisationService from "../services/localisation.service";
import type { ILocalisation, ILocalisationFormData } from "../types/ILocalisation";
import api from "../utils/axios";

const localisationKeys = {
  all: ["localisations"] as const,
};

// Récupérer toutes les localisations
export function useLocalisations() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['localisations'],
    queryFn: localisationService.getAllLocalisations,
  });

  useEffect(() => {
    if (query.isSuccess) {
      queryClient.invalidateQueries({ queryKey: localisationKeys.all });
    }
  }, [query.isSuccess, queryClient]);

  return query;
};

// Créer une localisation
export function useCreateLocalisation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (localisation: ILocalisationFormData) => {
      const response = await api.post("/localisations", localisation);
      return response.data as ILocalisation;
    },
    onSuccess: () => {      
      queryClient.invalidateQueries({ queryKey: localisationKeys.all });      
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Erreur inconnue";
      console.error("Erreur lors de la création de la localisation :", message);
    },
  });
}

