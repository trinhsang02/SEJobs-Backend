import { Router } from "express";

import { authenticate } from "@/middlewares/auth.middleware";
import { createLevel, deleteLevel, getLevel, getLevels, updateLevel } from "@/handlers/job_levels.handler";

const router = Router();

router.get("/", getLevels);
router.get("/:id", getLevel);
router.post("/", authenticate, createLevel);
router.put("/:id", authenticate, updateLevel);
router.delete("/:id", authenticate, deleteLevel);

export default router;
