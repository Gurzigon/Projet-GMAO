import type { IMaterial } from "./Imaterial";

export type ILocalisation = {
    id: number,
    label: string,
    materials: IMaterial[],
}

export type ILocalisationFormData = {
    id?: number,
    label: string,    
}