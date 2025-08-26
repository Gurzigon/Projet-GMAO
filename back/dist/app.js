import dotenv from 'dotenv';
import express from 'express';
import swaggerUi from "swagger-ui-express";
import swaggerSpecs from "./config/swagger.js";
import errorHandler from './middlewares/errorHandler.js';
import routes from "./routes/index.js";
const app = express();
const port = parseInt(process.env.PORT || "3000", 10);
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// --- Swagger ---
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
// --- Routes API ---
app.use("/api", routes);
// --- Error handler ---
app.use(errorHandler);
// --- Root ---
app.get("/", (_req, res) => {
    res.send("Welcome to the API. Visit /api-docs for documentation");
});
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
