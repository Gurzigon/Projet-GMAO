import { Router } from "express";
import { createMaterial, deleteMaterial, getAllMaterialAtelier, getAllMaterialSg, getMaterialByCategory, getMaterialById, statusMateriel, updateMaterial } from "../controllers/material.controller";
import errorHandler from "../middlewares/errorHandler";
import { validate } from '../middlewares/validate';
import { materialSchema } from "../validators/material.validator";
const materialRouter = Router();
/**
 * @swagger
 * tags:
 *   name: Materials
 *   description: API pour gérer les matériels
 */
/**
 * @swagger
 * /api/materials:
 *   post:
 *     summary: Créer un nouveau matériel
 *     tags: [Materials]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Material'
 *     responses:
 *       201:
 *         description: Matériel créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Material'
 *       400:
 *         description: Données invalides
 */
materialRouter.post('/', validate(materialSchema), createMaterial, errorHandler);
/**
 * @swagger
 * /api/materials:
 *   get:
 *     summary: Récupérer la liste des matériels de l'atelier
 *     tags: [Materials]
 *     responses:
 *       200:
 *         description: Liste des matériels
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Material'
 */
materialRouter.get('/atelier', getAllMaterialAtelier);
/**
 * @swagger
 * /api/materials:
 *   get:
 *     summary: Récupérer la liste des matériels des services généraux
 *     tags: [Materials]
 *     responses:
 *       200:
 *         description: Liste des matériels
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Material'
 */
materialRouter.get('/sg', getAllMaterialSg);
/**
 * @swagger
 * /api/materials/{id}:
 *   put:
 *     summary: Mettre à jour un matériel par son ID
 *     tags: [Materials]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du matériel
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Material'
 *     responses:
 *       200:
 *         description: Matériel mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Material'
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Matériel non trouvé
 */
materialRouter.put('/:id', validate(materialSchema), updateMaterial);
/**
 * @swagger
 * /api/materials/{id}:
 *   delete:
 *     summary: Supprimer un matériel par son ID
 *     tags: [Materials]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du matériel
 *     responses:
 *       204:
 *         description: Matériel supprimé avec succès
 *       404:
 *         description: Matériel non trouvé
 */
materialRouter.delete('/:id', deleteMaterial);
/**
 * @swagger
 * /api/materials/category/{categoryId}:
 *   get:
 *     summary: Récupérer tout le matériel d'une catégorie spécifique
 *     tags: [Materials]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la catégorie
 *     responses:
 *       200:
 *         description: Liste des matériels de la catégorie
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Material'
 *       400:
 *         description: ID de catégorie invalide
 *       500:
 *         description: Erreur serveur
 */
materialRouter.get('/category/:categoryId', getMaterialByCategory);
/**
 * @swagger
 * /api/materials/{id}:
 *   get:
 *     summary: Récupérer un matériel par son ID
 *     tags: [Materials]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du matériel
 *     responses:
 *       200:
 *         description: Détails du matériel
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Material'
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Matériel non trouvé
 *       500:
 *         description: Erreur serveur
 */
materialRouter.get('/:id', getMaterialById);
/**
 * @swagger
 * /api/materials/status/{statusId}/service/{id}:
 *   get:
 *     summary: Récupérer les matériels par statut et service
 *     tags: [Materials]
 *     parameters:
 *       - in: path
 *         name: statusId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du statut
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du service
 *     responses:
 *       200:
 *         description: Liste des matériels correspondant au statut et service
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Material'
 *       400:
 *         description: ID de statut ou service invalide
 *       404:
 *         description: Statut non trouvé
 *       500:
 *         description: Erreur serveur
 */
materialRouter.get('/status/:statusId/service/:id', statusMateriel);
