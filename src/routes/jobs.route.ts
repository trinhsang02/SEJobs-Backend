import { Router } from "express";
import { listJobs, getJob, createJob, updateJob, deleteJob, listJobsByCompany } from "@/handlers/jobs.handler";
import { authenticate } from "@/middlewares/auth.middleware";
import { authorizeRoles } from "@/middlewares/authorizeRoles";

const router = Router();

// Public list and get
router.get("/", listJobs);
router.get("/:id", getJob);

// Protected CRUD
router.post("/", authenticate, authorizeRoles("Admin", "Manager", "Employer"), createJob);
// router.post("/", createJob);
router.put("/:id", authenticate, authorizeRoles("Admin", "Manager", "Employer"), updateJob);
router.delete("/:id", authenticate, authorizeRoles("Admin", "Manager", "Employer"), deleteJob);

router.get("/company/:id", authenticate, authorizeRoles("Admin", "Manager", "Employer"), listJobsByCompany);

export default router;
