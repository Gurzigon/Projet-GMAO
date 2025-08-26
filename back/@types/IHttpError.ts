export default interface IHttpError extends Error {
  status?: number;
  details?: any;
}