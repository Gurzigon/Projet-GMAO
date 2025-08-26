/** biome-ignore-all lint/correctness/noUnusedFunctionParameters: <linter capricieux> */
import type { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export const getAllPriorities = async (
    req: Request,   
    res: Response,
    next: NextFunction
) => {
    try {
        const priorities = await prisma.priority.findMany(            
        );
        res.status(200).json(priorities);
    } catch (error) {
         next(error);
    }
}
