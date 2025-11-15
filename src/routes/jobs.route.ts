import { Router } from "express";
import { listJobs, getJob, createJob, updateJob, deleteJob } from "@/handlers/jobs/jobs.handler";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();

// Public list and get
router.get("/", listJobs);
router.get("/:id", getJob);

// Protected CRUD
router.post("/", authenticate, createJob);
router.put("/:id", authenticate, updateJob);
router.delete("/:id", authenticate, deleteJob);

export default router;
