import type { ICategory } from "./ICategory";
import type { ILocalisation } from "./ILocalisation";

export type IMaterialSearched = {
    id: number
    name : string,
    brand: string,
    model: string,
    description: string,
    serviceId: number,
    categoryId:  number,
    category?: ICategory
}

export type IMaterial= {
    id: number,
    name: string,
    brand: string,
    model: string,    
    quantity: number,
    registration: string,
    serial_number: string,
    engine_number:  string,
    buy_date: Date | null,
    comment: string,
    picture: string | null,
    mimetype?: string | null,
    serviceId:  number,
    categoryId:  number,
    category?: ICategory
    statusId?:  number | null,
    localisationId:  number | null,
    localisation?: ILocalisation | null;
    parentId:  number,
    typeId:  number,    
    parentGroupId: number
}

export type IUpdateMaterial= {    
    id: number;   
    name?: string,
    brand?: string,
    model?: string,
    quantity?: number,
    registration?: string,
    serial_number?: string,
    engine_number?:  string,
    categoryId?:  number,
    localisationId?:  number | null,
    buy_date?: Date | null,
    comment?: string,    
    statusId?:  number | null,
    serviceId?:  number,
}

export type IMaterialFormData = {
    name?: string,
    brand?: string,
    model?: string,
    quantity?: number,
    registration?: string,
    serial_number?: string,
    engine_number?:  string,
    categoryId?:  number | null
    localisationId?:  number | null,
    buy_date?: string | null,
    comment?: string,    
    statusId?:  number | null,
    serviceId?:  number | null,    
    mimetype?: string | null,
}

export type IStoreMaterial = {
    id: number,
    name: string,
    brand?: string,
    model?: string,
    quantity?: number,
    category?: ICategory,
    categoryId?:  number | null,
    reference?: string | null,
    is_store: boolean
    statusId: number
}

export type IStoreMaterialOut = {
    id: number,
    name: string,
    brand?: string,
    model?: string,
    quantity?: number,
    categoryId?:  number | null,
    reference?: string | null,
    is_store: boolean,
    status: number
}

export type IStoreMaterialFormData = {    
    name: string,
    brand?: string,
    model?: string,
    quantity?: number,
    categoryId?:  number | null,
    reference?: string | null,
    is_store: boolean
}

export type IConsumable= {
    name: string,
    brand: string,
    reference: string,
    quantity: number,
    statusId: number,
    is_store: boolean
}