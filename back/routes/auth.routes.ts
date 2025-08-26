import { Router } from "express";
import { getMe, login, logout } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/authMiddleware";
import errorHandler from "../middlewares/errorHandler";
import { validate } from '../middlewares/validate';
import { loginSchema } from "../validators/login.validator";


const authRouter = Router();


/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API pour gérer la connexion des utilisateurs
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Se connecter à l'application
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 firstname:
 *                   type: string
 *                 lastname:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     label:
 *                       type: string
 *       401:
 *         description: Email ou mot de passe invalide
 *       500:
 *         description: Erreur serveur
 */
authRouter.post('/login', validate(loginSchema), login, errorHandler);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Récupère les informations du compte connecté
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Données utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthenticatedUser'
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erreur serveur
 */
authRouter.get("/me",authMiddleware, getMe, );

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Un utilisateur se déconnecte
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Utilisateur déconnecté avec succès
 *       400:
 *         description: Erreur lors de la déconnexion
 */
authRouter.post("/logout", logout);

export default authRouter;
