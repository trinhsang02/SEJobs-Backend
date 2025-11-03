// src/createApp.ts
import "express-async-errors";
import express from "express";
import cors from "cors";
import testRoutes from "./routes/test.route";
import userRoutes from "./routes/users.route";
import authRoutes from "./routes/auth.route";
import jobRoutes from "./routes/jobs.route";
import { requestLogger, errorHandler } from "@/middlewares";
import { specs, swaggerUi } from "./config/swagger";
import logger from "./utils/logger";

export const createApp = () => {
  const app = express();

  // Middlewares
  app.use(cors({
    exposedHeaders: ["Authorization"],
  }));
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.use(requestLogger);

  // API Documentation
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
  logger.info("📚 Swagger API documentation is available at http://localhost:3000/api-docs");

  // Routes
  app.use("/api/test", testRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/jobs", jobRoutes);

  // Error handler
  app.use(errorHandler);

  return app;
};
