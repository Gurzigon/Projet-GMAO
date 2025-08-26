// import type { NextFunction, Request, Response } from "express";

// export const isAuthenticated = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): void => {
//   if (!req.session.user) {
//     res.status(401).json({ error: "Non authentifié" });
//     return;
//   }
//   next();
// };