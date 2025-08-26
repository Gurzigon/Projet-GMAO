import { Router } from "express";
import { createMovementIn, createMovementOut, getAllMovements } from "../controllers/movement.controller";
import errorHandler from "../middlewares/errorHandler";

const movementRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Mouvements
 *   description: API pour gérer les mouvements de stock
 */

/**
 * @swagger
 * /api/movements:
 *   get:
 *     summary: Récupérer tous les mouvements de stock
 *     tags: [Mouvements]
 *     responses:
 *       200:
 *         description: Liste des mouvements de stock
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mouvements'
 */
movementRouter.get('/', getAllMovements, errorHandler );

/**
 * @swagger
 * /api/movements:
 *   post:
 *     summary: Créé une entrée en stock
 *     tags: [Mouvements]
 *     responses:
 *       200:
 *         description: Créer une entrée en stock
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mouvements'
 */
movementRouter.post('/in', createMovementIn, errorHandler );

/**
 * @swagger
 * /api/movements:
 *   post:
 *     summary: Créé une sortie en stock
 *     tags: [Mouvements]
 *     responses:
 *       200:
 *         description: Créer une sortie en stock
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mouvements'
 */
movementRouter.post('/out', createMovementOut, errorHandler );


export default movementRouter;