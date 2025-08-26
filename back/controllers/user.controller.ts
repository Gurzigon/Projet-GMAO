/** biome-ignore-all lint/correctness/noUnusedFunctionParameters: <linter capricieux> */
import argon2 from "argon2";
import type { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { createHttpError } from "../utils/httpError";

const prisma = new PrismaClient();

// Créer un utilisateur
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  
  try {
    const { lastname, firstname, email, password, roleId, serviceId, validation_code } = req.body;

    if (validation_code === undefined || validation_code === null) {
      return res.status(400).json({ error: "Le code de validation est obligatoire" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
          return res.status(400).json({ error: "Email déjà utilisé" });
        }
        
    const hashedPassword = await argon2.hash(password); 

    const newUser = await prisma.user.create({
        
        data: {
          lastname,
          firstname,
          email,
          password: hashedPassword,
          roleId: Number(roleId),
          serviceId: Number(serviceId),
          validation_code
        },
        
      });      
      res.status(201).json({ user: newUser });
    } catch (error) {
      next(error);
    }
};

// Ajouter un utilisateur à une intervention
export const addUserToIntervention = async(
    req: Request,
    res: Response,
    next:NextFunction
) => {
    const interventionId = Number(req.params.id);
    const validationCode = Number(req.body.validationCode);

    if (Number.isNaN(interventionId) || Number.isNaN(validationCode)) {
    return res.status(400).json({ message: "ID utilisateur ou code invalide" });
  }

  try {
     // Je vérifie que l'intervention existe
    const intervention = await prisma.intervention.findUnique({
      where: { id: interventionId },
    });

    if (!intervention) {
      return res.status(404).json({ message: "Intervention non trouvée" });
    }

    // Je vérifie que l'utilisateur existe
    const user = await prisma.user.findFirst({
      where: { validation_code: validationCode},
    });

    if (!user) {
      return res.status(404).json({ message: "Code incorrect" });
    }

    const existing = await prisma.userIntervention.findFirst({
      where: {
        userId: user.id,
        interventionId: interventionId,
      },
    });

    if (existing) {
      return res.status(409).json({ message: "Utilisateur déjà assigné à cette intervention" });
    }

    // Je crée l'association dans la table de liaison
    await prisma.userIntervention.create({
        data: {
            userId: user.id,
            interventionId},
    });
     res.status(200).json({ message: ` L'utilisateur ${user.firstname} ${user.lastname} a bien été ajouté à l'intervention` });

  } catch (error) {
    next(error)
  }
};

// Ajouter un utilisateur à un préventif
export const addUserToPreventive = async(
    req: Request,
    res: Response,
    next:NextFunction
) => {
    const preventiveId = Number(req.params.id);
    const validationCode = Number(req.body.validationCode);

    if (Number.isNaN(preventiveId) || Number.isNaN(validationCode)) {
    return res.status(400).json({ message: "ID préventif ou code invalide" });
  }

  try {
     // Je vérifie que le préventif existe
    const preventive = await prisma.preventive.findUnique({
      where: { id: preventiveId },
    });

    if (!preventive) {
      return res.status(404).json({ message: "Préventif non trouvé" });
    };

    // Je vérifie que l'utilisateur existe
    const user = await prisma.user.findFirst({
      where: { validation_code: validationCode},
    });

    if (!user) {
      return res.status(403).json({ message: "Code incorrect" });
    };

    const existing = await prisma.userPreventive.findFirst({
      where: {
        userId: user.id,
        preventiveId: preventiveId,
      },
    });

    if (existing) {
      return res.status(409).json({ message: "Utilisateur déjà assigné à ce préventif" });
    };

    // Je crée l'association dans la table de liaison
    const relation = await prisma.userPreventive.create({
        data: { userId: user.id, preventiveId },
        include: { user: true }
    });
    res.status(200).json({
        message: `L'utilisateur ${user.firstname} ${user.lastname} a bien été ajouté au préventif`,
        relation
    });
  } catch (error) {
    next(error)
  };
};

// Modifier un utilisateur
export const updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Je récupère l'id de l'utilisateur selectionné
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    try {
        // Je récupère l'utilisateur en bdd
        const userSelected = await prisma.user.findUnique({
            where: {id}            
        });

        // Si l'id ne correspond à rien en bdd, j'envoie une erreur
        if (!userSelected) {
        throw createHttpError(404, `Matériel non trouvé`);
        }

        // Je modifie l'utilisateur' selectionné
        const userToUpdate = await prisma.user.update({
            data: {
                ...req.body,
                updated_at: new Date()
            },
            where: {id}
        });
        res.status(200).json({ message: ` L'utilisateur ${userToUpdate.firstname} ${userToUpdate.lastname} mis à jour avec succès` });
    } catch (error) {
        next(error)
    }
};

// Suppirmer un utilisateur
export const deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    
    // Je récupère l'id de l'utilisateur à supprimer
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "ID invalide" });
    }   
   
    // Je supprime l'utilisateur
    try {
         // Je récupère l'utilisateur en bdd
        const userSelected = await prisma.user.findUnique({
            where: {id}            
        });  

         // Si pas d'utilisateur' en bdd, j'envoie une erreur
        if (!userSelected) {
          throw createHttpError(404, `Utilisateur non trouvé`);
        }

        const userToDelete = await prisma.user.delete({
            where: {id}
        });
         res.status(200).json({ message: `${userToDelete.firstname} ${userToDelete.lastname} supprimé avec succès` });
    } catch (error) {
        next(error)
    }
};

// Récupérer tous les utilisateurs
export const getAllUsers = async (
    req: Request,
    res: Response,
    next:NextFunction 
) => {
    try {
        const allUsers = await prisma.user.findMany({
            orderBy: {
                serviceId: "asc"
            },
            include: {
                role: true,
                service: true
            }            
        })
        res.status(200).json(allUsers)
    } catch (error) {
        next(error)
    }
};

// Récupérer tous les utilisateurs par service
export const getAllUsersByService = async (
   req: Request,
    res: Response,
    next: NextFunction 
) => {
    const service = Number(req.params.id)
    try {
        const allUsers = await prisma.user.findMany({
            where: { serviceId: service}               
        })
        res.status(200).json(allUsers)
    } catch (error) {
       next(error) 
    }
};

// Récupérer tous les utilisateurs par rôle
export const getAllUsersByRole = async (
   req: Request,
    res: Response,
    next: NextFunction 
) => {
    const roleId = Number(req.params.id);

    try {
        const allUsersByRole = await prisma.user.findMany({
            where: { roleId: roleId}               
        })
        res.status(200).json(allUsersByRole)
    } catch (error) {
       next(error) 
    }
};

// Récupérer un utilisateur par son id
export const getUserById= async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Je récupère l'id de l'utilisateur sélectionné
    const  userId  = Number(req.params.id);

    if (Number.isNaN(userId)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    // Je vais rechercher en bdd l'utilisateur'l sélectionné
    try {
        const userById = await prisma.user.findUnique({
            where: {id: userId}
        })
        res.status(200).json(userById);
    } catch (error) {
        next(error); 
    }
};

// Récupérer tous les utilisateurs par intervention
export const getAllUsersByIntervention = async (
   req: Request,
    res: Response,
    next: NextFunction 
) => {

    const interventionId= Number(req.params.id);
    
    try {
        const allUsersByIntervention = await prisma.userIntervention.findMany({
            where: { interventionId: interventionId} ,
            include: {
                user: true
            }              
        })
        res.status(200).json(allUsersByIntervention)
    } catch (error) {
       next(error) 
    }
};