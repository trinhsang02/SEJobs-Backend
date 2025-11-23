import { Router } from "express";
import { authenticate } from "@/middlewares/auth.middleware";
import { createSkill, deleteSkill, getSkill, getSkills, updateSkill } from "@/handlers/skills.handler";
import { authorizeRoles } from "@/middlewares/authorizeRoles";

const router = Router();

router.get("/", getSkills);
router.get("/:id", getSkill);
router.post("/", authenticate, authorizeRoles("Admin", "Manager"), createSkill);
router.put("/:id", authenticate, authorizeRoles("Admin", "Manager"), updateSkill);
router.delete("/:id", authenticate, authorizeRoles("Admin", "Manager"), deleteSkill);

export default router;
