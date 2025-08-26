import type { IStoreMaterial } from "./Imaterial";

export type IMovement = {
  id : number,         
  is_incoming: boolean,
  is_outgoing: boolean,
  materialId: number 
  material?: IStoreMaterial
  quantity: number,
  created_at: Date,
  updated_at?: Date,
}