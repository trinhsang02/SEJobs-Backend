import { Router } from "express";
import {
  getMyApplications,
  createApplication,
  listCompanyApplications,
  getCompanyApplication,
  updateApplicationStatus,
} from "@/handlers/applications.handler";
import { authenticate } from "@/middlewares/auth.middleware";
import { upload } from "@/middlewares/upload.middleware";

const router = Router();

// Student routes
router.get("/me", authenticate, getMyApplications);
router.post("/", authenticate, upload.single("resume"), createApplication);

// Company routes
router.get("/company", authenticate, listCompanyApplications);
router.get("/company/:id", authenticate, getCompanyApplication);
router.put("/company/:id/status", authenticate, updateApplicationStatus);

export default router;
