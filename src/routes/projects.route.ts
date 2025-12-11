import { Router } from "express";
import {
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getProjectsByStudentId,
  listProjects,
} from "@/handlers/projects.handler";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, getProjectsByStudentId);
router.get("/:id", getProject);
router.post("/", authenticate, createProject);
router.put("/:id", authenticate, updateProject);
router.delete("/:id", authenticate, deleteProject);

export default router;
