import { PrismaClient } from "../generated/prisma";
import { createHttpError } from "../utils/httpError";
const prisma = new PrismaClient();
// Créer un entretien préventif
export const createPreventive = async (req, res, next) => {
    // Je récupère l'id du matériel à associer à l'entretien préventif
    const materialId = Number(req.params.id);
    try {
        const newPreventive = await prisma.preventive.create({
            data: {
                ...req.body,
                // si materialId est fourni, je l'ajoute dans data
                ...(materialId ? { materialId } : {})
            },
        });
        res.status(201).json({ preventive: newPreventive });
    }
    catch (error) {
        next(error);
    }
};
// Modifier un entretien préventif
export const updatePreventive = async (req, res, next) => {
    // Je récupère l'id de l'intervention selectionnée
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        return res.status(400).json({ message: "ID invalide" });
    }
    try {
        // Je récupère le préventif en bdd
        const preventiveSelected = await prisma.preventive.findUnique({
            where: { id }
        });
        // Si l'id ne correspond à rien en bdd, j'envoie une erreur
        if (!preventiveSelected) {
            throw createHttpError(404, `Entretien préventif non trouvé`);
        }
        // Je modifie le préventif selectionné
        const preventiveToUpdate = await prisma.preventive.update({
            data: {
                ...req.body,
                updated_at: new Date()
            },
            where: { id }
        });
        res.status(200).json({ message: `${preventiveToUpdate.title} mis à jour avec succès` });
    }
    catch (error) {
        next(error);
    }
};
// Suppirmer un entretien préventif
export const deletePreventive = async (req, res, next) => {
    // Je récupère l'id du préventif à supprimer
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        return res.status(400).json({ message: "ID invalide" });
    }
    // Je supprime le préventif
    try {
        // Je récupère le préventif en bdd
        const preventiveSelected = await prisma.preventive.findUnique({
            where: { id }
        });
        // Si pas de préventif en bdd, j'envoie une erreur
        if (!preventiveSelected) {
            throw createHttpError(404, `Entretien préventif non trouvé`);
        }
        const preventiveToDelete = await prisma.preventive.delete({
            where: { id }
        });
        res.status(200).json({ message: `${preventiveToDelete.title} supprimé avec succès` });
    }
    catch (error) {
        next(error);
    }
};
// Récupérer tous les entretiens préventifs du service Atelier
export const getAllPreventivesAtelier = async (req, res, next) => {
    try {
        const preventives = await prisma.preventive.findMany({
            where: { serviceId: 1 },
            orderBy: {
                created_at: "asc",
            }
        });
        res.status(200).json(preventives);
    }
    catch (error) {
        next(error);
    }
};
// Récupérer tous les entretiens préventifs du service Services Généraux
export const getAllPreventivesSg = async (req, res, next) => {
    try {
        const preventives = await prisma.preventive.findMany({
            where: { serviceId: 2 },
            orderBy: {
                created_at: "asc",
            }
        });
        res.status(200).json(preventives);
    }
    catch (error) {
        next(error);
    }
};
// Récupérer un entretien préventif par son id
export const getPreventiveById = async (req, res, next) => {
    // Je récupère l'id du préventif sélectionné
    const preventiveId = Number(req.params.id);
    if (Number.isNaN(preventiveId)) {
        return res.status(400).json({ message: "ID invalide" });
    }
    ;
    // Je vais rechercher en bdd le préventif sélectionné
    try {
        const preventiveById = await prisma.preventive.findUnique({
            where: { id: preventiveId }
        });
        res.status(200).json(preventiveById);
    }
    catch (error) {
        next(error);
    }
};
// Récupérer les entretiens préventifs par matériel
export const getPreventivesByMaterial = async (req, res, next) => {
    const materialId = Number(req.params.materialId);
    // Je vérifie que l'id corresponde à quelque chose
    if (Number.isNaN(materialId)) {
        return res.status(400).json({ message: "ID de statut invalide" });
    }
    ;
    try {
        // Vérifie si le préventif existe en bdd
        const materialExists = await prisma.material.findUnique({ where: { id: materialId } });
        if (!materialExists) {
            return res.status(404).json({ message: "Matériel non trouvé" });
        }
        // Récupère toutes les préventifs lié à un matériel
        const materialPreventives = await prisma.materialPreventive.findMany({
            where: { materialId },
            include: {
                preventive: {
                    include: {
                        service: true,
                    },
                },
            }
        });
        const preventives = materialPreventives.map((link) => link.preventive);
        res.status(200).json(preventives);
    }
    catch (error) {
        next(error);
    }
};
