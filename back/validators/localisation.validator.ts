import Joi from 'joi'

export const localisationSchema = Joi.object({
 label: Joi.string().allow(null, ''),  
});