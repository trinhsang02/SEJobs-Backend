import { Router } from "express";

import { authenticate } from "@/middlewares/auth.middleware";
import {
  createEmploymentType,
  deleteEmploymentType,
  getEmploymentType,
  getEmploymentTypes,
  updateEmploymentType,
} from "@/handlers/employment_types.handler";
import { authorizeRoles } from "@/middlewares/authorizeRoles";

const router = Router();

router.get("/", getEmploymentTypes);
router.get("/:id", getEmploymentType);
router.post("/", authenticate, authorizeRoles("Admin", "Manager"), createEmploymentType);
router.put("/:id", authenticate, authorizeRoles("Admin", "Manager"), updateEmploymentType);
router.delete("/:id", authenticate, authorizeRoles("Admin", "Manager"), deleteEmploymentType);

export default router;
