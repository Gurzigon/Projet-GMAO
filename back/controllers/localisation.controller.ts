import type { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Récupérer toutes les localisations
export const getAllLocalisations = async (
    _req: Request,   
    res: Response,
    next: NextFunction
) => {
    try {
        const localisations = await prisma.localisation.findMany(            
        );
        res.status(200).json(localisations);
    } catch (error) {
         next(error);
    }
};

// Créer une localisation
export const createLocalisation = async (req: Request, res: Response) => {
  try {
    const { label } = req.body;
    if (!label || label.trim() === "") {
      return res.status(400).json({ message: "Le champ 'label' est obligatoire." });
    }

    const labelNormalized = label.trim();

    const existing = await prisma.localisation.findFirst({
      where: { label: { equals: labelNormalized, mode: "insensitive" } },
    });

    if (existing) {
      return res.status(409).json({ message: "Cette localisation existe déjà." });
    }

    const newLocalisation = await prisma.localisation.create({
      data: { label: labelNormalized },
    });  

    res.status(201).json(newLocalisation);
  } catch (error) {
    console.error("Erreur création localisation :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

