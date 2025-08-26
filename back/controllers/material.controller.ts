/** biome-ignore-all lint/correctness/noUnusedFunctionParameters: <linter capricieux> */
import type { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { createHttpError } from "../utils/httpError";

const prisma = new PrismaClient();

// Créer un matériel
export const createMaterial = async (  
    req: Request,  
    res: Response,
    next: NextFunction
) => {
    try {
        const newMaterial = await prisma.material.create({
            data: req.body,
        });
        res.status(201).json({material: newMaterial})
    } catch (error) {
        next(error)
    }
};

// Modifier un matériel
export const updateMaterial = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Je récupère l'id du matériel selectionné
    const id = Number(req.body.id);

    if (Number.isNaN(id)) {
    return res.status(400).json({ message: "ID invalide" });
  }

    try {
        // Je récupère le matériel en bdd
        const materialSelected = await prisma.material.findUnique({
            where: {id}            
        });

        // Si l'id ne correspond à rien en bdd, j'envoie une erreur
        if (!materialSelected) {
        throw createHttpError(404, `Matériel non trouvé`);
        }
        
        // Je modifie le matériel selectionné
        const materialToUpdate = await prisma.material.update({
            data: {
                ...req.body,
                updated_at: new Date()
            },
            where: {id}
        });
        res.status(200).json({ message: `${materialToUpdate.name} mis à jour avec succès` });
    } catch (error) {
        next(error)
    }
};

// Suppirmer un matériel
export const deleteMaterial = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    
    // Je récupère l'id du matériel à supprimer
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
    return res.status(400).json({ message: "ID invalide" });
     }   
   
    // Je supprime le matériel
    try {
         // Je récupère le matériel en bdd
        const materialSelected = await prisma.material.findUnique({
            where: {id}            
        });  

         // Si pas de matériel en bdd, j'envoie une erreur
        if (!materialSelected) {
        throw createHttpError(404, `Matériel non trouvé`);
        }

        const materialToDelete = await prisma.material.delete({
            where: {id}
        });
         res.status(200).json({ message: `${materialToDelete.name} supprimé avec succès` });
    } catch (error) {
        next(error)
    }
};

// Récupérer tout le matériel du service Atelier
export const getAllMaterialAtelier = async ( 
    req: Request,   
    res: Response,
    next: NextFunction
) => {
    try {
        const materials = await prisma.material.findMany({
            where: {serviceId: 1},
        });
        res.status(200).json(materials);
    } catch (error) {
       next(error); 
    }
};

// Récupérer tout le matériel 
export const getAllMaterials = async ( 
    req: Request,   
    res: Response,
    next: NextFunction
) => {
    try {
        const materials = await prisma.material.findMany({
            include: {
                localisation: true,
                category: true,
                status: true
            },
            orderBy: {
                name: "asc"
            },
            where:{
                is_store: false
            }
        });
        res.status(200).json(materials);
    } catch (error) {
       next(error); 
    }
};

// Récupérer tout le matériel du service Service Généraux
export const getAllMaterialSg = async (  
    req: Request,  
    res: Response,
    next: NextFunction
) => {
    try {
        const materials = await prisma.material.findMany({
            where: {serviceId: 2},
        });
        res.status(200).json(materials);
    } catch (error) {
       next(error); 
    }
};

// Récupérer tout le matériel d'une catégorie
export const getMaterialByCategory = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const categoryId =  Number(req.params.categoryId);
    try {
         if (Number.isNaN(categoryId)) {
            return res.status(400).json({ message: "ID de catégorie invalide" });
    }
        const materialByCategory = await prisma.material.findMany({
            where:{categoryId:categoryId }
        })
         res.status(200).json(materialByCategory);
    } catch (error) {
       next(error); 
    }
};

// Récupérer un matériel par son id
export const getMaterialById= async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Je récupère l'id du matériel sélectionné
    const  materialId  = Number(req.params.id);

    if (Number.isNaN(materialId)) {
    return res.status(400).json({ message: "ID invalide" });
    }

    // Je vais rechercher en bdd le matériel sélectionné
    try {
        const materialById = await prisma.material.findUnique({
            where: {id: materialId},
            include: {
                category: true,
                localisation: true
            }
        })
        res.status(200).json(materialById);
    } catch (error) {
        next(error); 
    }
};

// Récupérer les matériels par status
export const statusMateriel = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusId = Number(req.params.statusId);
    const serviceId = Number(req.params.id)

  // Je vérifie que l'id corresponde à quelque chose
  if (Number.isNaN(statusId)) {
    return res.status(400).json({ message: "ID de statut invalide" });
  };

  if (Number.isNaN(serviceId)) {
    return res.status(400).json({ message: "ID du service invalide" });
  };
  
  try {
     // Vérifie si le statut existe en bdd
    const statusExists = await prisma.status.findUnique({ where: { id: statusId } });

    if (!statusExists) {
      return res.status(404).json({ message: "Statut non trouvé" });
    }

    // Récupère toutes les interventions du service avec ce statut
    const materials = await prisma.material.findMany({
      where: { statusId, serviceId },
      include: {
        service: true,
        category: true,        
        type: true,
        localisation: true,
        status: true,
      },
    });

    res.status(200).json(materials);
  } catch (error) {
    next(error)
  }
};

// Récupérer le matériel MAGASIN
export const getStoreMateriel = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
        
  try {
    
    // Récupère toutes les matériels du magasin
    const storeMaterials = await prisma.material.findMany({
      where: { 
        is_store: true
       },
      include: {        
        category: true      
      },
    });

    res.status(200).json(storeMaterials);
  } catch (error) {
    next(error)
  }
};