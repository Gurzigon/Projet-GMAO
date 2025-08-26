import type { NextFunction, Request, Response } from "express";

/**
 * Middleware qui supprime les champs indésirables du body (pour éviter les injections de code malveillant dans les champs des formulaires)
 */
export const sanitizeBody = (fieldsToRemove: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    for (const field of fieldsToRemove) {
      if (field in req.body) {
        delete req.body[field];
      }
    }
    next();
  };
};