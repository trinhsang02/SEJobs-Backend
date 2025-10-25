// src/createApp.ts
import 'express-async-errors';
import express from "express";
import cors from "cors";
import testRoutes from "./routes/test.route";
import userRoutes from "./routes/users.route";
import { requestLogger, errorHandler }  from '@/middlewares';

export const createApp = () => {
  const app = express();

  // Middlewares
  app.use(cors());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));


  app.use(requestLogger);
  // Routes (sẽ import sau)
  app.use("/api/test", testRoutes);
  // app.use('/api/auth', authRoutes);
  app.use("/api/users", userRoutes);

  // Error handler (phải ở cuối)
  app.use(errorHandler);

  return app;
};
