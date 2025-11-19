import { Router } from "express";

import { authenticate } from "@/middlewares/auth.middleware";
import {
  createEmploymentType,
  deleteEmploymentType,
  getEmploymentType,
  getEmploymentTypes,
  updateEmploymentType,
} from "@/handlers/employment_types.handler";

const router = Router();

router.get("/", getEmploymentTypes);
router.get("/:id", getEmploymentType);
router.post("/", authenticate, createEmploymentType);
router.put("/:id", authenticate, updateEmploymentType);
router.delete("/:id", authenticate, deleteEmploymentType);

export default router;
