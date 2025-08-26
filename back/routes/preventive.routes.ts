import { Router } from "express";
import { createPreventive, deletePreventive, getAllPreventives, getAllPreventivesAtelier, getAllPreventivesSg, getPreventiveById, getPreventivesByMaterial, updatePreventive, updateStatusPreventive } from "../controllers/preventive.controller";
import errorHandler from "../middlewares/errorHandler";
import { validate } from '../middlewares/validate';
import { preventiveSchema } from "../validators/preventive.validator";

const preventiveRouter = Router()

/**
 * @swagger
 * tags:
 *   name: Preventives
 *   description: API pour gérer les entretiens préventifs
 */

/**
 * @swagger
 * /api/preventives/material/{id}:
 *   post:
 *     summary: Créer un entretien préventif pour un matériel avec ID dans l'URL
 *     tags: [Preventives]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du matériel
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Preventive'
 *     responses:
 *       201:
 *         description: Entretien préventif créé avec succès
 */
preventiveRouter.post("/material/:id", validate(preventiveSchema), createPreventive, errorHandler);

/**
 * @swagger
 * /api/preventives/material:
 *   post:
 *     summary: Créer un entretien préventif pour un matériel avec formulaire
 *     tags: [Preventives]    
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Preventive'
 *     responses:
 *       201:
 *         description: Entretien préventif créé avec succès
 */
preventiveRouter.post("/material", validate(preventiveSchema), createPreventive, errorHandler);

/**
 * @swagger
 * /api/preventives/{id}:
 *   put:
 *     summary: Mettre à jour un entretien préventif
 *     tags: [Preventives]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'entretien préventif
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Preventive'
 *     responses:
 *       200:
 *         description: Entretien préventif mis à jour avec succès
 */
preventiveRouter.put("/:id", validate(preventiveSchema), updatePreventive, errorHandler);

/**
 * @swagger
 * /api/preventives/{id}:
 *   put:
 *     summary: Mettre à jour le status un entretien préventif
 *     tags: [Preventives]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'entretien préventif
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Preventive'
 *     responses:
 *       200:
 *         description: Entretien préventif mis à jour avec succès
 */
preventiveRouter.put("/status/:id", validate(preventiveSchema), updateStatusPreventive, errorHandler);

/**
 * @swagger
 * /api/preventives/{id}:
 *   delete:
 *     summary: Supprimer un entretien préventif
 *     tags: [Preventives]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'entretien préventif
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Entretien préventif supprimé avec succès
 */
preventiveRouter.delete("/:id", deletePreventive, errorHandler);

/**
 * @swagger
 * /api/preventives/atelier:
 *   get:
 *     summary: Récupérer tous les entretiens préventifs du service Atelier
 *     tags: [Preventives]
 *     responses:
 *       200:
 *         description: Liste des entretiens préventifs de l'atelier
 */
preventiveRouter.get("/atelier", getAllPreventivesAtelier, errorHandler);

/**
 * @swagger
 * /api/preventives/:
 *   get:
 *     summary: Récupérer tous les entretiens préventifs 
 *     tags: [Preventives]
 *     responses:
 *       200:
 *         description: Liste des entretiens préventifs 
 */
preventiveRouter.get("/", getAllPreventives, errorHandler);

/**
 * @swagger
 * /api/preventives/sg:
 *   get:
 *     summary: Récupérer tous les entretiens préventifs des Services Généraux
 *     tags: [Preventives]
 *     responses:
 *       200:
 *         description: Liste des entretiens préventifs SG
 */
preventiveRouter.get("/sg", getAllPreventivesSg, errorHandler);

/**
 * @swagger
 * /api/preventives/{id}:
 *   get:
 *     summary: Récupérer un entretien préventif par ID
 *     tags: [Preventives]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'entretien préventif
 *     responses:
 *       200:
 *         description: Détails de l'entretien préventif
 */
preventiveRouter.get("/:id", getPreventiveById, errorHandler);

/**
 * @swagger
 * /api/preventives/material/{materialId}:
 *   get:
 *     summary: Récupérer les entretiens préventifs d'un matériel
 *     tags: [Preventives]
 *     parameters:
 *       - in: path
 *         name: materialId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du matériel
 *     responses:
 *       200:
 *         description: Liste des entretiens liés au matériel
 */
preventiveRouter.get("/material/:materialId", getPreventivesByMaterial, errorHandler);


export default preventiveRouter;