import Joi from 'joi'

export const interventionSchema = Joi.object({
  title: Joi.string().allow(null, ''),
  description: Joi.string().allow(null, ''),  
  initial_comment: Joi.string().allow(null, ''),
  final_comment: Joi.string().allow(null, ''),
  begin_date: Joi.date().iso().allow(null),
  validation_code: Joi.number().integer().allow(null),
  picture: Joi.binary().allow(null),
  mimetype: Joi.string().valid(
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/gif',
    'application/pdf'
  ).allow(null),
  materialId: Joi.number().integer().allow(null),
  serviceId: Joi.number().integer().allow(null),
  localisationId: Joi.number().integer().allow(null),
  statusId: Joi.number().integer().allow(null),
  categoryId: Joi.number().integer().allow(null),
  priorityId: Joi.number().integer().allow(null),
  typeId: Joi.number().integer().allow(null),
  requestor_firstname: Joi.string().allow(null, ''), 
  requestor_lastname: Joi.string().allow(null, ''), 
});