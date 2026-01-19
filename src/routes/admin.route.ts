import { Router } from "express";
import { getAdminDashboard } from "@/handlers/admin.handler";
import { authenticate } from "@/middlewares/auth.middleware";
import { requireRole } from "@/middlewares/role.middleware";
import { Database } from "@/types/database";

type UserRole = Database["public"]["Enums"]["role"];

const router = Router();

router.get("/dashboard", authenticate, requireRole("Admin" as UserRole), getAdminDashboard);

export default router;
