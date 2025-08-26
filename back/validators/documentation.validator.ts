import Joi from 'joi'

export const documentationSchema = Joi.object({
  title: Joi.string().required(),

  file: Joi.binary().allow(null),
  mimetype: Joi.string().valid(
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ).allow(null),

  materialId: Joi.number().integer().allow(null),
})
