// src/createApp.ts
import express from "express";
import cors from "cors";
import testRoutes from "./routes/test.route";
import { errorHandler } from "./middlewares/error.middleware";

export const createApp = () => {
  const app = express();

  // Middlewares
  app.use(cors());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));

  // Routes (sẽ import sau)
  app.use("/api/test", testRoutes);
  // app.use('/api/auth', authRoutes);
  // app.use('/api/users', userRoutes);

  // Error handler (phải ở cuối)
  app.use(errorHandler);

  return app;
};
