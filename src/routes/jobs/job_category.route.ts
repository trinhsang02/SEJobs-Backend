import { Router } from "express";
import {
  getJobCategories,
  createJobCategory,
  updateJobCategory,
  deleteJobCategory,
} from "@/handlers/jobs/job_category.handler";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();

router.get("/", getJobCategories);
router.post("/", authenticate, createJobCategory);
router.put("/:id", authenticate, updateJobCategory);
router.delete("/:id", authenticate, deleteJobCategory);

export default router;
