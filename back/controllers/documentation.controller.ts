/** biome-ignore-all lint/correctness/noUnusedFunctionParameters: <linter capricieux> */
import type { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { createHttpError } from "../utils/httpError";

const prisma = new PrismaClient();

// Créer une documentation
export const createDocumentation = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Je récupère l'id du matériel à associer à la documentation
    const materialId = Number(req.params.id);

    try {
        // Je crée la documentation en bdd
        const newDocumentaion = await prisma.documentation.create({
            data: {
                ...req.body,
                ...(materialId ? {materialId} : {} )
            },
        });
        res.status(201).json({material: newDocumentaion})
    } catch (error) {
        next(error)
    }
}

// Modifier une documentation
export const updateDocumentation = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Je récupère l'id de la documentation selectionnée
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
    return res.status(400).json({ message: "ID invalide" });
  }

    try {
        // Je récupère la documentation en bdd
        const documentationSelected = await prisma.documentation.findUnique({
            where: {id}            
        });

        // Si l'id ne correspond à rien en bdd, j'envoie une erreur
        if (!documentationSelected) {
        throw createHttpError(404, `Documentation non trouvée`);
        }

        // Je modifie la documentation selectionnée
        const documentationToUpdate = await prisma.documentation.update({
            data: {
                ...req.body,
                updated_at: new Date()
            },
            where: {id}
        });
        res.status(200).json({ message: `${documentationToUpdate.title} mis à jour avec succès` });
    } catch (error) {
        next(error)
    }
};

// Suppirmer une documentation
export const deleteDocumentation = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    
    // Je récupère l'id de la documentation à supprimer
    const id = Number(req.params.id);


    if (Number.isNaN(id)) {
    return res.status(400).json({ message: "ID invalide" });
     };
      
    try {

         // Je récupère la documentation en bdd
        const documentationSelected = await prisma.documentation.findUnique({
            where: {id}            
        });  

         // Si pas d'intervention' en bdd, j'envoie une erreur
        if (!documentationSelected) {
        throw createHttpError(404, `Documentation non trouvée`);
        }
        // Je supprime la documentation
        const documentationToDelete = await prisma.documentation.delete({
            where: {id}
        });
         res.status(200).json({ message: `${documentationToDelete.title} supprimé avec succès` });
    } catch (error) {
        next(error)
    }
};

// Récupérer toute la documentation d'un matériel
export const getMaterialDocumentations = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Je récupère l'id du matériel concerné dans l'URL
    const materialId = Number(req.params.id);

    if (Number.isNaN(materialId)) {
    return res.status(400).json({ message: "ID de matériel invalide" });
    };

    try {
         // Je vérifie que le matériel existe avant de récupérer la documentation
        const materialExists = await prisma.material.findUnique({
        where: { id: materialId }
        });

        if (!materialExists) {
        return res.status(404).json({ message: "Matériel non trouvé" });
        };

        // Je vais chercher en bdd toute la documentation relative au matériel
        const documentations = await prisma.documentation.findMany({
            where: { materialId: materialId}
        })
        res.status(200).json(documentations );
    } catch (error) {
       next(error) 
    }
};

// Récupérer une documentation par ID
export const getDocumentationById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Je récupère l'id du matériel dans l'URL
    const documentationId = Number(req.params.id);

    if (Number.isNaN(documentationId)) {
    return res.status(400).json({ message: "ID de documentation invalide" });
    };

    try {
        // Je vérifie que la documentation existe en bdd
        const documentationExists = await prisma.documentation.findUnique({
            where: {id: documentationId}
        })

        if (!documentationExists) {
        return res.status(404).json({ message: "Documentation non trouvée" });
        };
        
        res.status(200).json(documentationExists);
    } catch (error) {
       next(error) 
    }

};