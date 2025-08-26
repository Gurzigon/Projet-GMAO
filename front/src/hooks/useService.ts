import { useQuery } from "@tanstack/react-query";
import serviceService from "../services/services.service";




// Récupérer toutes les services
export function useServices() {  

  const query = useQuery({
    queryKey: ['services'],
    queryFn: serviceService.getAllServices,
  }); 

  return query;
};

export function useService(label?: string){
  const {data: services, ... rest} = useServices();

  const service = services?.find(
    (s) => s.label.toLowerCase() === label?.toLowerCase()
  );
  return {service, ...rest}
}

