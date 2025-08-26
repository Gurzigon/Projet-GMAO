import { PrismaClient } from "../generated/prisma";
import { createHttpError } from "../utils/httpError";
const prisma = new PrismaClient();
// Créer une intervention
export const createIntervention = async (req, res, next) => {
    // Je récupère l'id du matériel à associer à l'intervention
    const materialId = Number(req.params.id);
    try {
        const newIntervention = await prisma.intervention.create({
            data: {
                ...req.body,
                // si materialId est fourni, je l'ajoute dans data
                ...(materialId ? { materialId } : {})
            },
        });
        res.status(201).json({ material: newIntervention });
    }
    catch (error) {
        next(error);
    }
};
// Modifier une intervention
export const updateIntervention = async (req, res, next) => {
    // Je récupère l'id de l'intervention selectionnée
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        return res.status(400).json({ message: "ID invalide" });
    }
    try {
        // Je récupère l'intervention' en bdd
        const interventionSelected = await prisma.intervention.findUnique({
            where: { id }
        });
        // Si l'id ne correspond à rien en bdd, j'envoie une erreur
        if (!interventionSelected) {
            throw createHttpError(404, `Intervention non trouvée`);
        }
        // Je modifie l'intervention' selectionnée
        const interventionToUpdate = await prisma.intervention.update({
            data: {
                ...req.body,
                updated_at: new Date()
            },
            where: { id }
        });
        res.status(200).json({ message: `${interventionToUpdate.title} mis à jour avec succès` });
    }
    catch (error) {
        next(error);
    }
};
// Modifier le status d'une intervention
export const updateInterventionStatus = async (req, res, next) => {
    // Je récupère l'id de l'intervention selectionnée
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        return res.status(400).json({ message: "ID invalide" });
    }
    ;
    // Je récupère le status de l'intervention
    const { statusId } = req.body;
    // Vérification du champ statusId
    if (!statusId || typeof statusId !== "number") {
        return res.status(400).json({ message: "ID de statut manquant ou invalide" });
    }
    try {
        // Je récupère l'intervention' en bdd si elle existe
        const interventionSelected = await prisma.intervention.findUnique({
            where: { id }
        });
        // Si l'id ne correspond à rien en bdd, j'envoie une erreur
        if (!interventionSelected) {
            throw createHttpError(404, `Intervention non trouvée`);
        }
        const updateStatus = await prisma.intervention.update({
            where: { id },
            data: {
                statusId,
                updated_at: new Date(),
            },
        });
        res.status(200).json({ message: `${updateStatus.title} mis à jour avec succès` });
    }
    catch (error) {
        next(error);
    }
};
// Suppirmer une intervention
export const deleteIntervention = async (req, res, next) => {
    // Je récupère l'id de l'intervention à supprimer
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        return res.status(400).json({ message: "ID invalide" });
    }
    // Je supprime l'intervention
    try {
        // Je récupère l'intervention en bdd
        const interventionSelected = await prisma.intervention.findUnique({
            where: { id }
        });
        // Si pas d'intervention' en bdd, j'envoie une erreur
        if (!interventionSelected) {
            throw createHttpError(404, `Matériel non trouvé`);
        }
        const interventionToDelete = await prisma.intervention.delete({
            where: { id }
        });
        res.status(200).json({ message: `${interventionToDelete.title} supprimé avec succès` });
    }
    catch (error) {
        next(error);
    }
};
// Récupérer toutes les interventions du service Atelier
export const getAllInterventionsAtelier = async (req, res, next) => {
    try {
        const interventions = await prisma.intervention.findMany({
            where: { serviceId: 1 },
            orderBy: {
                created_at: "asc",
            }
        });
        res.status(200).json(interventions);
    }
    catch (error) {
        next(error);
    }
};
// Récupérer toutes les interventions du service Service Généraux
export const getAllInterventionsSg = async (req, res, next) => {
    try {
        const interventions = await prisma.intervention.findMany({
            where: { serviceId: 2 },
        });
        res.status(200).json(interventions);
    }
    catch (error) {
        next(error);
    }
};
// Récupérer toutes les interventions d'une catégorie
export const getInterventionByCategory = async (req, res, next) => {
    const categoryId = Number(req.params.categoryId);
    try {
        if (Number.isNaN(categoryId)) {
            return res.status(400).json({ message: "ID de catégorie invalide" });
        }
        const interventionByCategory = await prisma.intervention.findMany({
            where: { categoryId: categoryId }
        });
        res.status(200).json(interventionByCategory);
    }
    catch (error) {
        next(error);
    }
};
// Récupérer une intervention par son id
export const getInterventionById = async (req, res, next) => {
    // Je récupère l'id de l'intervention sélectionnée
    const interventionId = Number(req.params.id);
    if (Number.isNaN(interventionId)) {
        return res.status(400).json({ message: "ID invalide" });
    }
    // Je vais rechercher en bdd l'intervention'sélectionnée
    try {
        const interventionById = await prisma.intervention.findUnique({
            where: { id: interventionId }
        });
        res.status(200).json(interventionById);
    }
    catch (error) {
        next(error);
    }
};
// Récupérer les interventions par status
export const getInterventionsByStatus = async (req, res, next) => {
    const statusId = Number(req.params.statusId);
    // Je vérifie que l'id corresponde à quelque chose
    if (Number.isNaN(statusId)) {
        return res.status(400).json({ message: "ID de statut invalide" });
    }
    ;
    try {
        // Vérifie si le statut existe en bdd
        const statusExists = await prisma.status.findUnique({ where: { id: statusId } });
        if (!statusExists) {
            return res.status(404).json({ message: "Statut non trouvé" });
        }
        // Récupère toutes les interventions du service avec ce statut
        const interventions = await prisma.statusIntervention.findMany({
            where: { statusId },
            include: {
                intervention: {
                    include: {
                        service: true,
                        category: true,
                        priority: true,
                        type: true,
                        localisation: true,
                    }
                }
            }
        });
        // Extraire uniquement les interventions des liens
        const interventionsLinked = interventions.map(si => si.intervention);
        res.status(200).json(interventionsLinked);
    }
    catch (error) {
        next(error);
    }
};
// Récupérer les interventions par matériel
export const getInterventionsByMaterial = async (req, res, next) => {
    const materialId = Number(req.params.materialId);
    // Je vérifie que l'id corresponde à quelque chose
    if (Number.isNaN(materialId)) {
        return res.status(400).json({ message: "ID de statut invalide" });
    }
    ;
    try {
        // Vérifie si le matériel existe en bdd
        const materialExists = await prisma.material.findUnique({ where: { id: materialId } });
        if (!materialExists) {
            return res.status(404).json({ message: "Matériel non trouvé" });
        }
        // Récupère toutes les interventions lié à un matériel
        const materialInterventions = await prisma.materialIntervention.findMany({
            where: { materialId },
            include: {
                intervention: {
                    include: {
                        service: true,
                        status: true,
                        type: true,
                        priority: true,
                        category: true,
                    },
                },
            }
        });
        const interventions = materialInterventions.map((link) => link.intervention);
        res.status(200).json(interventions);
    }
    catch (error) {
        next(error);
    }
};
