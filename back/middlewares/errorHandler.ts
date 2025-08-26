import type { NextFunction, Request, Response } from 'express';
import type { IErrorDetails } from '../@types/IErrorDetails';

const errorHandler = (
  err: IErrorDetails, 
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {    
    return next(err);
  }

  console.error(err);

  const status = err.status || 500;
  const message = err.message || 'Une erreur est survenue sur le serveur';
  const details = err.details || undefined;

  res.status(status).json({
    message,
    details,
  });
};

export default errorHandler;