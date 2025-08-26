import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import typeService from "../services/type.service";

const typeKeys = {
  all: ["type"] as const,
};

// Récupérer tous les types
export function useType() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['type'],
    queryFn: typeService.getAllTypes,
  });

  useEffect(() => {
    if (query.isSuccess) {
      queryClient.invalidateQueries({ queryKey: typeKeys.all });
    }
  }, [query.isSuccess, queryClient]);

  return query;
}