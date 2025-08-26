import { Router } from "express";
import { getAllTypes } from "../controllers/type.controller";
import errorHandler from "../middlewares/errorHandler";

const typeRouter = Router();


/**
 * @swagger
 * tags:
 *   name: type
 *   description: API pour gérer les types d'intervention
 */

/**
 * @swagger
 * /api/type:
 *   get:
 *     summary: Récupérer tous les types
 *     tags: [types]
 *     responses:
 *       200:
 *         description: Liste des types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/types'
 */
typeRouter.get('/', getAllTypes, errorHandler );

export default typeRouter;