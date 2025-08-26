import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../config/swagger.js";
const router = Router();
router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
export default router;
