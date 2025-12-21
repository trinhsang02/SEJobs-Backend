import { Router } from "express";

import { authenticate } from "@/middlewares/auth.middleware";
import { authorizeRoles } from "@/middlewares/authorizeRoles";
import { getNotifications } from "@/handlers/notifications.handler";

const router = Router();

router.get("/", getNotifications);

export default router;
