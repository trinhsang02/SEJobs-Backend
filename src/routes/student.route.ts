import { getStudent, getStudents } from "@/handlers/student.handler";
import { authenticate } from "@/middlewares/auth.middleware";
import { authorizeRoles } from "@/middlewares/authorizeRoles";
import { Router } from "express";

const router = Router();
router.get("/", authenticate, authorizeRoles("Admin"), getStudents);
router.get("/:id", authenticate, authorizeRoles("Admin"), getStudent);

export default router;