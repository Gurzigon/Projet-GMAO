import { Router } from "express";
import errorHandler from "../middlewares/errorHandler";
import { createCategory, deleteCategory, getAllCategories, updateCategory } from "../controllers/category.controller";

const categoryRouter = Router();


/**
 * @swagger
 * tags:
 *   name: category
 *   description: API pour gérer les catégories
 */

/**
 * @swagger
 * /api/category:
 *   get:
 *     summary: Récupérer toutes les catégories
 *     tags: [category]
 *     responses:
 *       200:
 *         description: Liste des catégories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/category'
 */
categoryRouter.get('/', getAllCategories, errorHandler );

/**
 * @swagger
 * /api/category:
 *   post:
 *     summary: Créer une catégorie
 *     tags: [category]
 *     responses:
 *       200:
 *         description: Créer une catégorie
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/category'
 */
categoryRouter.post('/', createCategory, errorHandler );

/**
 * @swagger
 * /api/category/{id}:
 *   delete:
 *     summary: Supprimer une catégorie par ID
 *     tags: [category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la catégorie à supprimer
 *     responses:
 *       200:
 *         description: Catégorie supprimée avec succès
 *       400:
 *         description: Requête invalide ou catégorie non supprimable
 *       404:
 *         description: Catégorie non trouvée
 */
categoryRouter.delete('/:id', deleteCategory, errorHandler);

/**
 * @swagger
 * /api/category/{id}:
 *   put:
 *     summary: Modifier une catégorie existante
 *     tags: [category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la catégorie à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - label
 *               - serviceId
 *             properties:
 *               label:
 *                 type: string
 *               serviceId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Catégorie modifiée avec succès
 *       400:
 *         description: Requête invalide
 *       404:
 *         description: Catégorie non trouvée
 */
categoryRouter.put('/:id', updateCategory, errorHandler );

export default categoryRouter;