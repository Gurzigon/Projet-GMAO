/** biome-ignore-all lint/correctness/noUnusedFunctionParameters: <linter capricieux> */
import type { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Récupérer toutes les interventions
export const getAllServices = async (
  req: Request,   
    res: Response,
    next: NextFunction
) => {
  try {
    const services = await prisma.service.findMany()
    res.status(200).json(services);
  } catch (error) {
    next(error);
  }
}