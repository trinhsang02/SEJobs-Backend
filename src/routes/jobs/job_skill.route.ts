import { Router } from "express";
import { getJobSkills, createJobSkill, updateJobSkill, deleteJobSkill } from "@/handlers/jobs/job_skill.handler";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();

router.get("/", getJobSkills);
router.post("/", authenticate, createJobSkill);
router.put("/:id", authenticate, updateJobSkill);
router.delete("/:id", authenticate, deleteJobSkill);

export default router;
