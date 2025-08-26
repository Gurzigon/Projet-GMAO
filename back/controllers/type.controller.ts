/** biome-ignore-all lint/correctness/noUnusedFunctionParameters: <linter capricieux> */
import type { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export const getAllTypes = async (
    req: Request,   
    res: Response,
    next: NextFunction
) => {
    try {
        const types = await prisma.type.findMany(            
        );
        res.status(200).json(types);
    } catch (error) {
         next(error);
    }
}
