import { Router } from "express";
import {createUser} from "../controllers/user.controller"
import { addUserToIntervention, addUserToPreventive, deleteUser, getAllUsers, getAllUsersByIntervention, getAllUsersByRole, getAllUsersByService, getUserById, updateUser } from "../controllers/user.controller";
import errorHandler from "../middlewares/errorHandler";
import { validate } from '../middlewares/validate';
import { userSchema } from "../validators/user.validator";

const userRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API pour gérer les utilisateurs
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Créer un nouvel utilisateur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 */
userRouter.post('/', validate(userSchema), createUser, errorHandler);

/**
 * @swagger
 * /api/users/intervention/{id}:
 *   post:
 *     summary: Ajouter un utilisateur à une intervention
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'intervention
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               validationCode:
 *                 type: integer
 *                 example: 123456
 *                 description: Code de validation personnel de l'utilisateur
 *     responses:
 *       200:
 *         description: Utilisateur ajouté à l'intervention avec succès
 *       403:
 *         description: Code de validation incorrect
 *       409:
 *         description: Utilisateur déjà assigné
 */
userRouter.post('/intervention/:id', addUserToIntervention, errorHandler);

/**
 * @swagger
 * /api/users/preventive/{id}:
 *   post:
 *     summary: Ajouter un utilisateur à un préventif
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du préventif
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               validationCode:
 *                 type: integer
 *                 example: 123456
 *                 description: Code de validation personnel de l'utilisateur
 *     responses:
 *       200:
 *         description: Utilisateur ajouté au préventif avec succès
 *       403:
 *         description: Code de validation incorrect
 *       409:
 *         description: Utilisateur déjà assigné
 */
userRouter.post('/preventive/:id', addUserToPreventive, errorHandler);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Mettre à jour un utilisateur
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès
 */
userRouter.put('/:id', validate(userSchema), updateUser, errorHandler);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 */
userRouter.delete('/:id', deleteUser, errorHandler);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 */
userRouter.get('/', getAllUsers, errorHandler);

/**
 * @swagger
 * /api/users/service/{id}:
 *   get:
 *     summary: Récupérer les utilisateurs par service
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du service
 *     responses:
 *       200:
 *         description: Liste des utilisateurs du service
 */
userRouter.get('/service/:id', getAllUsersByService, errorHandler);

/**
 * @swagger
 * /api/users/role/{id}:
 *   get:
 *     summary: Récupérer les utilisateurs par rôle
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du rôle
 *     responses:
 *       200:
 *         description: Liste des utilisateurs du rôle
 */
userRouter.get('/role/:id', getAllUsersByRole, errorHandler);

/**
 * @swagger
 * /api/users/intervention/{id}:
 *   get:
 *     summary: Récupérer les utilisateurs par intervention
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'intervention
 *     responses:
 *       200:
 *         description: Liste des utilisateurs d'une intervention
 */
userRouter.get('/intervention/:id', getAllUsersByIntervention, errorHandler);

/**
 * @swagger
 * /api/users/role/{id}:
 *   get:
 *     summary: Récupérer les utilisateurs par rôle
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du rôle
 *     responses:
 *       200:
 *         description: Liste des utilisateurs du rôle
 */
userRouter.get('/role/:id', getAllUsersByRole, errorHandler);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Récupérer un utilisateur par ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Détails de l'utilisateur
 */
userRouter.get('/:id', getUserById, errorHandler);

export default userRouter;