import Joi from 'joi';
export const preventiveSchema = Joi.object({
    title: Joi.string().allow(null, ''),
    description: Joi.string().allow(null, ''),
    process: Joi.string().allow(null, ''),
    date: Joi.date().iso().allow(null),
    serviceId: Joi.number().integer().allow(null),
});
