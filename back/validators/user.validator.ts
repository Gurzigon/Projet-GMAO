import Joi from 'joi'

export const userSchema = Joi.object({
  lastname: Joi.string().required(),
  firstname: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  validation_code: Joi.number().integer().integer().min(1).max(999999).required(),
  roleId: Joi.number().integer().required(),
  serviceId: Joi.number().integer().required(),
})
