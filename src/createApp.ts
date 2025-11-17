// src/createApp.ts
import "express-async-errors";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import testRoutes from "./routes/test.route";
import userRoutes from "./routes/users.route";
import companyRoutes from "./routes/company.route";
import companyTypeRoutes from "./routes/company_type.route";
import authRoutes from "./routes/auth.route";
import jobRoutes from "./routes/jobs.route";
import jobCategoryRoutes from "./routes/jobs/job_category.route";
import jobSkillRoutes from "./routes/jobs/job_skill.route";
import jobEmploymentTypeRoutes from "./routes/jobs/job_employment_type.route";
import jobLevelRoutes from "./routes/jobs/job_level.route";
import { requestLogger, errorHandler } from "@/middlewares";
import { specs, swaggerUi } from "./config/swagger";
import logger from "./utils/logger";

export const createApp = () => {
  const app = express();

  // Middlewares
  app.use(
    cors({
      exposedHeaders: ["Authorization"],
    })
  );
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(requestLogger);

  // API Documentation
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
  logger.info("📚 Swagger API documentation is available at http://localhost:3000/api-docs");

  // Routes
  app.use("/api/test", testRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/companies", companyRoutes);
  app.use("/api/company_types", companyTypeRoutes);
  app.use("/api/jobs", jobRoutes);
  app.use("/api/job-categories", jobCategoryRoutes);
  app.use("/api/job-skills", jobSkillRoutes);
  app.use("/api/job-employment-types", jobEmploymentTypeRoutes);
  app.use("/api/job-levels", jobLevelRoutes);

  // Error handler
  app.use(errorHandler);

  return app;
};
