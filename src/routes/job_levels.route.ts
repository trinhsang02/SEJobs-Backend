import { Router } from "express";
import { authenticate } from "@/middlewares/auth.middleware";
import { createLevel, deleteLevel, getLevel, getLevels, updateLevel } from "@/handlers/levels.handler";
import { authorizeRoles } from "@/middlewares/authorizeRoles";

const router = Router();

router.get("/", getLevels);
router.get("/:id", getLevel);
router.post("/", authenticate, authorizeRoles("Admin", "Manager"), createLevel);
router.put("/:id", authenticate, authorizeRoles("Admin", "Manager"), updateLevel);
router.delete("/:id", authenticate, authorizeRoles("Admin", "Manager"), deleteLevel);

export default router;
