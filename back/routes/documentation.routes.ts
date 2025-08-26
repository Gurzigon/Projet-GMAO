import { Router } from "express";
import { createDocumentation, deleteDocumentation, getDocumentationById, getMaterialDocumentations, updateDocumentation } from "../controllers/documentation.controller";
import errorHandler from "../middlewares/errorHandler";
import { validate } from '../middlewares/validate';
import { documentationSchema } from "../validators/documentation.validator";

const documentationRouter = Router()

/**
 * @swagger
 * tags:
 *   name: Documentations
 *   description: API pour gérer les documentations
 */

/**
 * @swagger
 * /api/documentations/material/{id}:
 *   post:
 *     summary: Créer une documentation pour un matériel
 *     tags: [Documentations]
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
 *             $ref: '#/components/schemas/Documentation'
 *     responses:
 *       201:
 *         description: Documentation créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Documentation'
 *       400:
 *         description: Données invalides
 */
documentationRouter.post("/material/:id", validate(documentationSchema), createDocumentation, errorHandler);

/**
 * @swagger
 * /api/documentations/{id}:
 *   put:
 *     summary: Mettre à jour une documentation
 *     tags: [Documentations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la documentation
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Documentation'
 *     responses:
 *       200:
 *         description: Documentation mise à jour avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Documentation non trouvée
 */
documentationRouter.put("/:id", validate(documentationSchema), updateDocumentation, errorHandler);

/**
 * @swagger
 * /api/documentations/{id}:
 *   delete:
 *     summary: Supprimer une documentation
 *     tags: [Documentations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la documentation
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Documentation supprimée avec succès
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Documentation non trouvée
 */
documentationRouter.delete("/:id", deleteDocumentation, errorHandler);

/**
 * @swagger
 * /api/documentations/material/{id}:
 *   get:
 *     summary: Récupérer toute la documentation d'un matériel
 *     tags: [Documentations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du matériel
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des documentations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Documentation'
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Matériel non trouvé
 */
documentationRouter.get("/material/:id", getMaterialDocumentations, errorHandler);

/**
 * @swagger
 * /api/documentations/{id}:
 *   get:
 *     summary: Récupérer une documentation par ID
 *     tags: [Documentations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la documentation
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détails de la documentation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Documentation'
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Documentation non trouvée
 */
documentationRouter.get("/:id", getDocumentationById, errorHandler);


export default documentationRouter;