import type { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

// Récupérer toutes les catégories
export const getAllCategories = async (
    _req: Request,   
    res: Response,
    next: NextFunction
) => {
    try {
        const categories = await prisma.category.findMany( {
            include:{
                materials: true
            },
            orderBy:{
                label: "asc"
            }
        }           
        );
        res.status(200).json(categories);
    } catch (error) {
         next(error);
    }
}

// Créer une catégorie
export const createCategory = async (
    req: Request,   
    res: Response,
    _next: NextFunction
) => {
    try{
        const {label, serviceId}= req.body;

         const labelTrimmed = label.trim();
        if (!labelTrimmed) {
        return res.status(400).json({ error: "Label vide ou invalide." });
        };

        if (!label || typeof label !== "string") {
            return res.status(400).json({ error: "Label invalide." });
        };

         if (!serviceId || typeof serviceId !== "number") {
            return res.status(400).json({ error: "ServiceId invalide." });
        };

        const existingCategory = await prisma.category.findFirst({
            where: {
                label: {
                    equals: labelTrimmed,
                    mode: "insensitive"
                }
            }
        });

        if(existingCategory) {
            return res.status(200).json(existingCategory)
        }       

        const newCategory = await prisma.category.create({
            data: {
                label : labelTrimmed,
                serviceId: serviceId,
            }
        });
         return res.status(201).json(newCategory);
    }catch(error){
        console.error("Erreur création catégorie :", error)
        return res.status(500).json({error : "Erreur serveur."});
    }
}

// Supprimer une catégorie
export const deleteCategory = async (
    req: Request,   
    res: Response,
    _next: NextFunction) => 
        {
     try {
    const { id } = req.params;

    if (!id || Number.isNaN(Number(id))) {
      return res.status(400).json({ error: "ID de catégorie invalide." });
    }

    // Vérifie si la catégorie existe
    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
      include: { materials: true }, // pour info, si on veut vérifier les matériaux liés
    });

    if (!category) {
      return res.status(404).json({ error: "Catégorie non trouvée." });
    }

    const materialCount = await prisma.material.count({
        where: { categoryId: Number(id) }
    });
    if (materialCount > 0) {
        return res.status(400).json({
            error: "Impossible de supprimer une catégorie contenant des matériaux."
        });
    }

    // Suppression de la catégorie
    await prisma.category.delete({
      where: { id: Number(id) },
    });

    return res.status(200).json({ message: `Catégorie  supprimée.` });
  } catch (error) {
    console.error("Erreur suppression catégorie :", error);
    return res.status(500).json({ error: "Erreur serveur." });
  }
};

// Modifier une catégorie
export const updateCategory = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { label, serviceId } = req.body;

    // Vérif id
    if (!id || Number.isNaN(Number(id))) {
      return res.status(400).json({ error: "ID de catégorie invalide." });
    }

    // Vérif label
    if (!label || typeof label !== "string" || !label.trim()) {
      return res.status(400).json({ error: "Label invalide." });
    }

    // Vérif serviceId
    if (!serviceId || typeof serviceId !== "number") {
      return res.status(400).json({ error: "ServiceId invalide." });
    }

    const labelTrimmed = label.trim();

    // Vérifie si la catégorie existe
    const existingCategory = await prisma.category.findUnique({
      where: { id: Number(id) },
    });

    if (!existingCategory) {
      return res.status(404).json({ error: "Catégorie non trouvée." });
    }

    // Vérifie qu'une autre catégorie n'a pas déjà ce label
    const duplicate = await prisma.category.findFirst({
      where: {
        label: { equals: labelTrimmed, mode: "insensitive" },
        NOT: { id: Number(id) },
      },
    });

    if (duplicate) {
      return res
        .status(400)
        .json({ error: "Une autre catégorie utilise déjà ce label." });
    }

    // Mise à jour
    const updatedCategory = await prisma.category.update({
      where: { id: Number(id) },
      data: {
        label: labelTrimmed,
        serviceId,
      },
    });

    return res.status(200).json(updatedCategory);
  } catch (error) {
    console.error("Erreur modification catégorie :", error);
    return res.status(500).json({ error: "Erreur serveur." });
  }
};
