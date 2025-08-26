/** biome-ignore-all lint/correctness/noUnusedFunctionParameters: <linter capricieux> */
import type { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Récupérer tous les mouvements de stock
export const getAllMovements = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const movements = await prisma.movement.findMany({
      include: {
        material: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
    res.status(200).json(movements);
  } catch (error) {
    next(error);
  }
};

// Créer un mouvement de stockIn
export const createMovementIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { materialId, quantity } = req.body;

  try {
    const material = await prisma.material.findUnique({ where: { id: materialId } });

    if (!material) {
      return res.status(404).json({ error: "Matériel non trouvé" });
    }

    const updatedMaterial = await prisma.material.update({
      where: { id: materialId },
      data: {
        quantity: (material.quantity ?? 0) + quantity,
      },
    }); 

    const movement = await prisma.movement.create({
      data: {
        materialId,
        quantity,
        is_incoming: true,
        is_outgoing: false,
      },
    });
    res.status(201).json({movement, updatedMaterial});
  } catch (error) {
    next(error);
  }
};

// Créer un mouvement de stockOut
export const createMovementOut = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { materialId, quantity } = req.body; 
  
  try {

    const material = await prisma.material.findUnique({ where: { id: materialId } });

    if (!material) {
      return res.status(404).json({ error: "Matériel non trouvé" });
    }

    const currentQuantity = material.quantity ?? 0;

    if (currentQuantity < quantity) {
      return res.status(400).json({ error: "Stock insuffisant" });
    }

     const updatedMaterial = await prisma.material.update({
      where: { id: materialId },
      data: {
        quantity: currentQuantity - quantity,
      },
    });

    const movement = await prisma.movement.create({
      data: {
        materialId,
        quantity,
        is_incoming: false,
        is_outgoing: true,
      },
    });
    res.status(201).json({ movement, updatedMaterial });
  } catch (error) {
    next(error);
  }
};
