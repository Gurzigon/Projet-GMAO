import Joi from 'joi';

export const materialSchema = Joi.object({
  id: Joi.number().allow(null,''),
  is_store: Joi.boolean().default(false),
  name: Joi.string(),
  brand: Joi.string().allow(null, ''),
  model: Joi.string().allow(null, ''),  
  quantity: Joi.number().integer().min(0).allow(null),
  registration: Joi.string().allow(null, ''),
  serial_number: Joi.string().allow(null, ''),
  engine_number: Joi.string().allow(null, ''),
  buy_date: Joi.date().iso().allow(null),
  comment: Joi.string().allow(null, ''),
  reference: Joi.string().allow(null, ''),
  picture: Joi.binary().allow(null), 
  mimetype: Joi.string().valid(
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/gif',
    'application/pdf'
  ).allow(null,''),
  serviceId: Joi.number().integer().allow(null),
  categoryId: Joi.number().integer().allow(null),
  statusId: Joi.number().integer().allow(null),
  localisationId: Joi.number().integer().allow(null),
  parentId: Joi.number().integer().allow(null),
  typeId: Joi.number().integer().allow(null),

})