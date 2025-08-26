import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import priorityService from "../services/priority.service";

const priorityKeys = {
  all: ["priority"] as const,
};

// Récupérer toutes les matériels
export function usePriority() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['priority'],
    queryFn: priorityService.getAllPriority,
  });

  useEffect(() => {
    if (query.isSuccess) {
      queryClient.invalidateQueries({ queryKey: priorityKeys.all });
    }
  }, [query.isSuccess, queryClient]);

  return query;
}