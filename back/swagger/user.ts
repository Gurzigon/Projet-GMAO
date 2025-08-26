/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         lastname:
 *           type: string
 *           example: "Dupont"
 *         firstname:
 *           type: string
 *           example: "Claire"
 *         email:
 *           type: string
 *           format: email
 *           example: "claire.dupont@example.com"
 *         password:
 *           type: string
 *           format: password
 *           example: "Claire#2025!"
 *         roleId:
 *           type: integer
 *           example: 2
 *         serviceId:
 *           type: integer
 *           example: 3
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2025-07-18T08:30:00Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2025-07-18T08:45:00Z"
 */
