/** biome-ignore-all lint/suspicious/noExplicitAny: <linter capricieux> */
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Lire le token dans le cookie
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Token manquant" });

  try {
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET non défini");
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: number };
    (req as any).userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ message: "Token invalide" });
  }
};
