import { Router } from "express";
import * as experiencesHandler from "@/handlers/experiences.handler";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();

router.get("/", experiencesHandler.listExperiences);
router.get("/:id", experiencesHandler.getExperience);
router.post("/", authenticate, experiencesHandler.createExperience);
router.put("/:id", authenticate, experiencesHandler.updateExperience);
router.delete("/:id", authenticate, experiencesHandler.deleteExperience);
router.get("/student/me", authenticate, experiencesHandler.getExperiencesByStudentId);

export default router;
