import { Router } from "express";
import { getAllServices } from "../controllers/service.controller";
import errorHandler from "../middlewares/errorHandler";

const serviceRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Services
 *   description: API pour gérer les services
 */

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Récupérer tous les services
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: Liste des services
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Services'
 */
serviceRouter.get('/', getAllServices, errorHandler );

export default serviceRouter;