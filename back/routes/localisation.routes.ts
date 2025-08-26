import { Router } from "express";
import { createLocalisation, getAllLocalisations } from "../controllers/localisation.controller";
import errorHandler from "../middlewares/errorHandler";


const localisationRouter = Router();


/**
 * @swagger
 * tags:
 *   name: Localisations
 *   description: API pour gérer les localisations
 */

/**
 * @swagger
 * /api/localisations:
 *   get:
 *     summary: Récupérer toutes les localisations
 *     tags: [Localisations]
 *     responses:
 *       200:
 *         description: Liste des localisations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Localisation'
 */
localisationRouter.get('/', getAllLocalisations, errorHandler );

/**
 * @swagger
 * /api/localisations:
 *   post:
 *     summary: Créer une nouvelle localisation
 *     tags: [Localisations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - label
 *             properties:
 *               label:
 *                 type: string
 *                 description: Nom de la localisation
 *     responses:
 *       201:
 *         description: Localisation créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Localisation'
 *       400:
 *         description: Champ label manquant
 *       409:
 *         description: Localisation déjà existante
 */
localisationRouter.post('/', createLocalisation, errorHandler);

export default localisationRouter;