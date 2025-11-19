import { Router } from "express";

import { authenticate } from "@/middlewares/auth.middleware";
import {
  createJobLevel,
  getJobLevel,
  getJobLevels,
  updateJobLevel,
  deleteJobLevel,
} from "@/handlers/job_levels.handler";

const router = Router();

router.get("/", getJobLevels);
router.get("/:id", getJobLevel);
router.post("/", authenticate, createJobLevel);
router.put("/:id", authenticate, updateJobLevel);
router.delete("/:id", authenticate, deleteJobLevel);

export default router;
