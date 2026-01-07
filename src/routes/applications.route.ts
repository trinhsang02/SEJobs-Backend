import { Router } from "express";
import {
  createApplication,
  getApplication,
} from "@/handlers/applications.handler";
import { authenticate } from "@/middlewares/auth.middleware";
import { authorizeRoles } from "@/middlewares/authorizeRoles";

const router = Router();

// TODO: TEMP
router.get("/:id", authenticate, getApplication);
router.post("/", authenticate, authorizeRoles("Student"), createApplication);

// router.get("/company", authenticate, listCompanyApplications);
// router.get("/company/:id", authenticate, getCompanyApplication);
// router.put("/company/:id/status", authenticate, updateApplicationStatus);

export default router;
