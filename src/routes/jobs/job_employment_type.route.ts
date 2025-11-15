import { Router } from "express";
import {
  getJobEmploymentTypes,
  createJobEmploymentType,
  updateJobEmploymentType,
  deleteJobEmploymentType,
} from "@/handlers/jobs/job_employment_type.handler";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();

router.get("/", getJobEmploymentTypes);
router.post("/", authenticate, createJobEmploymentType);
router.put("/:id", authenticate, updateJobEmploymentType);
router.delete("/:id", authenticate, deleteJobEmploymentType);

export default router;
