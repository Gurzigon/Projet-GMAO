import IHttpError from "../@types/IHttpError";


export const createHttpError = (status: number, message: string, details?: any): IHttpError => {
  const error: IHttpError = new Error(message) as IHttpError;
  error.status = status;
  if (details) {
    error.details = details;
  }
  return error;
};