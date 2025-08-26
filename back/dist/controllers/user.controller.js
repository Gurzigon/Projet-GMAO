import { PrismaClient } from "../generated/prisma";
import { createHttpError } from "../utils/httpError";

const prisma = new PrismaClient();
// Créer un utilisateur
export const createUser = async (req, res, next) => {
    try {
        const newUser = await prisma.user.create({
            data: req.body,
        });
        res.status(201).json({ user: newUser });
    }
    catch (error) {
        next(error);
    }
};
// Ajouter un utilisateur à une intervention
export const addUserToIntervention = async (req, res, next) => {
    const interventionId = Number(req.params.id);
    const userId = Number(req.body.userId);
    if (Number.isNaN(interventionId) || Number.isNaN(userId)) {
        return res.status(400).json({ message: "ID utilisateur ou intervention invalide" });
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
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        // Je crée l'association dans la table de liaison
        await prisma.userIntervention.create({
            data: { interventionId, userId },
        });
    }
    catch (error) {
        next(error);
    }
};
// Modifier un utilisateur
export const updateUser = async (req, res, next) => {
    // Je récupère l'id de l'utilisateur selectionné
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        return res.status(400).json({ message: "ID invalide" });
    }
    try {
        // Je récupère l'utilisateur en bdd
        const userSelected = await prisma.user.findUnique({
            where: { id }
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
            where: { id }
        });
        res.status(200).json({ message: ` L'utilisateur ${userToUpdate.firstname} ${userToUpdate.lastname} mis à jour avec succès` });
    }
    catch (error) {
        next(error);
    }
};
// Suppirmer un utilisateur
export const deleteUser = async (req, res, next) => {
    // Je récupère l'id de l'utilisateur à supprimer
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        return res.status(400).json({ message: "ID invalide" });
    }
    // Je supprime l'utilisateur
    try {
        // Je récupère l'utilisateur en bdd
        const userSelected = await prisma.user.findUnique({
            where: { id }
        });
        // Si pas d'utilisateur' en bdd, j'envoie une erreur
        if (!userSelected) {
            throw createHttpError(404, `Utilisateur non trouvé`);
        }
        const userToDelete = await prisma.user.delete({
            where: { id }
        });
        res.status(200).json({ message: `${userToDelete.firstname} ${userToDelete.lastname} supprimé avec succès` });
    }
    catch (error) {
        next(error);
    }
};
// Récupérer tous les utilisateurs
export const getAllUsers = async (req, res, next) => {
    try {
        const allUsers = await prisma.user.findMany({
            orderBy: {
                serviceId: "asc"
            }
        });
        res.status(200).json(allUsers);
    }
    catch (error) {
        next(error);
    }
};
// Récupérer tous les utilisateurs par service
export const getAllUsersByService = async (req, res, next) => {
    const service = Number(req.params.id);
    try {
        const allUsers = await prisma.user.findMany({
            where: { serviceId: service }
        });
        res.status(200).json(allUsers);
    }
    catch (error) {
        next(error);
    }
};
// Récupérer tous les utilisateurs par rôle
export const getAllUsersByRole = async (req, res, next) => {
    const roleId = Number(req.params.id);
    try {
        const allUsersByRole = await prisma.user.findMany({
            where: { roleId: roleId }
        });
        res.status(200).json(allUsersByRole);
    }
    catch (error) {
        next(error);
    }
};
// Récupérer un utilisateur par son id
export const getUserById = async (req, res, next) => {
    // Je récupère l'id de l'utilisateur sélectionné
    const userId = Number(req.params.id);
    if (Number.isNaN(userId)) {
        return res.status(400).json({ message: "ID invalide" });
    }
    // Je vais rechercher en bdd l'utilisateur'l sélectionné
    try {
        const userById = await prisma.user.findUnique({
            where: { id: userId }
        });
        res.status(200).json(userById);
    }
    catch (error) {
        next(error);
    }
};
