import { Router } from "express";
import { getAllPriorities } from "../controllers/priority.controller";
import errorHandler from "../middlewares/errorHandler";

const priorityRouter = Router();


/**
 * @swagger
 * tags:
 *   name: priorities
 *   description: API pour gérer les priorités
 */

/**
 * @swagger
 * /api/priorities:
 *   get:
 *     summary: Récupérer toutes les priorités
 *     tags: [priorities]
 *     responses:
 *       200:
 *         description: Liste des priorités
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/priority'
 */
priorityRouter.get('/', getAllPriorities, errorHandler );

export default priorityRouter;