import { createExperience, deleteExperience, getExperienceById, getExperiences, updateExperience } from "@/handlers/experiences.handler";
import { Router } from "express";

const router = Router();

router.get("/", getExperiences);

router.get("/:id", getExperienceById);

router.post("/", createExperience);

router.put("/:id", updateExperience);

router.delete("/:id", deleteExperience);

export default router;