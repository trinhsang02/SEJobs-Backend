import { login, register } from "@/handlers/auth.handler";
import { Router } from "express";

const router = Router();

router.post("/login", login);
router.post("/register", register);

export default router;