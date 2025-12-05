import { Router } from "express";
import {
  getEducation,
  createEducation,
  updateEducation,
  deleteEducation,
} from "@/handlers/educations.handler";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();

router.get("/:id", getEducation);
router.post("/", authenticate, createEducation);
router.put("/:id", authenticate, updateEducation);
router.delete("/:id", authenticate, deleteEducation);

export default router;