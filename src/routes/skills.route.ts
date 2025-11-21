import { Router } from "express";
import { authenticate } from "@/middlewares/auth.middleware";
import { createSkill, deleteSkill, getSkill, getSkills, updateSkill } from "@/handlers/skills.handler";

const router = Router();

router.get("/", getSkills);
router.get("/:id", getSkill);
router.post("/", authenticate, createSkill);
router.put("/:id", authenticate, updateSkill);
router.delete("/:id", authenticate, deleteSkill);

export default router;
