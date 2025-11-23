import { Router } from "express";
import { authenticate } from "@/middlewares/auth.middleware";
import { createCategory, deleteCategory, getCategories, updateCategory } from "@/handlers/categories.handler";
import { authorizeRoles } from "@/middlewares/authorizeRoles";

const router = Router();

router.get("/", getCategories);
router.post("/", authenticate, authorizeRoles("Admin", "Manager"), createCategory);
router.put("/:id", authenticate, authorizeRoles("Admin", "Manager"), updateCategory);
router.delete("/:id", authenticate, authorizeRoles("Admin", "Manager"), deleteCategory);

export default router;
