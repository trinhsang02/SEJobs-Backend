import { Router } from "express";
import { authenticate } from "@/middlewares/auth.middleware";
import { createCategory, deleteCategory, getCategories, updateCategory } from "@/handlers/categories.handler";

const router = Router();

router.get("/", getCategories);
router.post("/", authenticate, createCategory);
router.put("/:id", authenticate, updateCategory);
router.delete("/:id", authenticate, deleteCategory);

export default router;
