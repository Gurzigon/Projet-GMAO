import type { IMaterial, IUpdateMaterial } from "../types/Imaterial";

export const toUpdateMaterial = (material: IMaterial): IUpdateMaterial => ({
  id: material.id,
  name: material.name,
  brand: material.brand,
  model: material.model,
  quantity: material.quantity,
  registration: material.registration,
  serial_number: material.serial_number,
  engine_number: material.engine_number,
  categoryId: material.categoryId,
  localisationId: material.localisationId,
  buy_date: material.buy_date,
  comment: material.comment,
  statusId: material.statusId,
  serviceId: material.serviceId
});
