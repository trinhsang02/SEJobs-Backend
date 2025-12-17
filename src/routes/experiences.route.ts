import * as experiencesHandler from "@/handlers/experiences.handler";
import { authenticate } from "@/middlewares/auth.middleware";
import { Router } from "express";

const router = Router();

router.get("/", experiencesHandler.getExperiences);

router.get("/:id", experiencesHandler.getExperienceById);

router.post("/", authenticate, experiencesHandler.createExperience);

router.put("/:id", authenticate, experiencesHandler.updateExperience);

router.delete("/:id", authenticate, experiencesHandler.deleteExperience);

router.get("/student/me", authenticate, experiencesHandler.getExperiencesByStudentId);

export default router;
