import Joi from 'joi';
export const interventionSchema = Joi.object({
    title: Joi.string().allow(null, ''),
    description: Joi.string().allow(null, ''),
    detail: Joi.string().allow(null, ''),
    initial_comment: Joi.string().allow(null, ''),
    final_comment: Joi.string().allow(null, ''),
    begin_date: Joi.date().iso().allow(null),
    picture: Joi.binary().allow(null),
    mimetype: Joi.string().valid('image/png', 'image/jpeg', 'image/webp', 'image/gif', 'application/pdf').allow(null),
    serviceId: Joi.number().integer().allow(null),
    localisationId: Joi.number().integer().allow(null),
    statusId: Joi.number().integer().allow(null),
    categoryId: Joi.number().integer().allow(null),
    priorityId: Joi.number().integer().allow(null),
    typeId: Joi.number().integer().allow(null),
});
