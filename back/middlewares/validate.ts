import  type { NextFunction, Request, RequestHandler, Response } from 'express';
import  type Joi from 'joi';

// Joi sert à valider les entrés des formulaires
export const validate = (
  schema: Joi.ObjectSchema,
  property: 'body' | 'params' | 'query' = 'body'
): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req[property], { abortEarly: false});

    if (error) {
      return next(error);
    };
    // Assigne les valeurs validées (utile si le schéma transforme les données)
    req[property] = value;

    next();
  };
};