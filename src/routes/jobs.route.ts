import { Router } from "express";
import { listJobs, getJob, createJob, updateJob, deleteJob } from "@/handlers/jobs.handler";
import { authenticate } from "@/middlewares/auth.middleware";
import { authorizeRoles } from "@/middlewares/authorizeRoles";

const router = Router();

// Public list and get
router.get("/", listJobs);
router.get("/:id", getJob);

// Protected CRUD
router.post("/", authenticate, authorizeRoles("Admin", "Manager"), createJob);
router.put("/:id", authenticate, authorizeRoles("Admin", "Manager"), updateJob);
router.delete("/:id", authenticate, authorizeRoles("Admin", "Manager"), deleteJob);

export default router;
