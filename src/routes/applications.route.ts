import { Router } from "express";
import {
  createApplication,
  getApplication,
  listApplications,
  listCompanyApplications,
} from "@/handlers/applications.handler";
import { authenticate } from "@/middlewares/auth.middleware";
import { authorizeRoles } from "@/middlewares/authorizeRoles";

const router = Router();

router.get("/company/list", authenticate, authorizeRoles("Employer"), listCompanyApplications);
// router.put("/company/:id/status", authenticate, updateApplicationStatus);

router.get("/", authenticate, authorizeRoles("Student"), listApplications);
router.get("/:id", authenticate, authorizeRoles("Student"), getApplication);
router.post("/", authenticate, authorizeRoles("Student"), createApplication);

export default router;
