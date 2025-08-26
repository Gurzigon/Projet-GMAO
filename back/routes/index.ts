import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../config/swagger";
import authRouter from "./auth.routes";
import categoryRouter from "./category.routes";
import documentationRouter from "./documentation.routes";
import interventionRouter from "./intervention.routes";
import localisationRouter from "./localisation.routes";
import materialRouter from "./material.routes";
import movementRouter from "./movement.routes";
import preventiveRouter from "./preventive.routes";
import priorityRouter from "./priority.routes";
import serviceRouter from "./service.routes";
import typeRouter from "./type.routes";
import userRouter from "./user.routes";



const router = Router();

router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

router.use("/materials", materialRouter);
router.use("/interventions", interventionRouter);
router.use("/documentations", documentationRouter);
router.use("/preventives", preventiveRouter);
router.use("/users", userRouter);
router.use("/auth", authRouter);
router.use("/services", serviceRouter)
router.use("/localisations", localisationRouter)
router.use("/priorities", priorityRouter)
router.use("/categories", categoryRouter)
router.use("/types", typeRouter)
router.use("/movements", movementRouter)

export default router;