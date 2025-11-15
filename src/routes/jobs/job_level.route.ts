import { Router } from "express";
import { getJobLevels, createJobLevel, updateJobLevel, deleteJobLevel } from "@/handlers/jobs/job_level.handler";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();

router.get("/", getJobLevels);
router.post("/", authenticate, createJobLevel);
router.put("/:id", authenticate, updateJobLevel);
router.delete("/:id", authenticate, deleteJobLevel);

export default router;
