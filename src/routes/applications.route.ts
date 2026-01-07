import { Router } from "express";
import {
  createApplication,
  getApplication,
  listApplications,
  companyListApplications,
  updateApplication,
  companyUpdateApplication,
  companyGetApplication,
} from "@/handlers/applications.handler";
import { authenticate } from "@/middlewares/auth.middleware";
import { authorizeRoles } from "@/middlewares/authorizeRoles";

const router = Router();

router.get("/company/list", authenticate, authorizeRoles("Employer"), companyListApplications);
router.get("/company/:application_id", authenticate, authorizeRoles("Employer"), companyGetApplication);
router.put("/company/:application_id", authenticate, authorizeRoles("Employer"), companyUpdateApplication);
// router.put("/company/:id/status", authenticate, updateApplicationStatus);

router.get("/", authenticate, authorizeRoles("Student"), listApplications);
router.get("/:id", authenticate, authorizeRoles("Student"), getApplication);
router.post("/", authenticate, authorizeRoles("Student"), createApplication);
router.put("/:id", authenticate, authorizeRoles("Student"), updateApplication);

export default router;
