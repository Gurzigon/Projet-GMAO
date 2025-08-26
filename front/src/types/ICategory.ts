import type { IMaterial } from "./Imaterial";
import type { IService } from "./IService";

export type ICategory = {
    id: number,
    label: string,
    materials: IMaterial[],
    service: IService[],
    subCategories?: ICategory[],
    serviceId: number    
}

export type ICategoryFormData = {
    id?: number,
    label: string    
}
