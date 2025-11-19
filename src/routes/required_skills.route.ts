import { Router } from "express";
import { getJobSkills, createJobSkill, updateJobSkill, deleteJobSkill, getJobSkill } from "@/handlers/skills.handler";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();

router.get("/", getJobSkills);
router.get("/:id", getJobSkill);
router.post("/", authenticate, createJobSkill);
router.put("/:id", authenticate, updateJobSkill);
router.delete("/:id", authenticate, deleteJobSkill);

export default router;
