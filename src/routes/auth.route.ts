import { login, register, getMe, logout, refreshToken } from "@/handlers/auth.handler";
import { Router } from "express";
import { authenticate } from "@/middlewares/auth.middleware";
import { requestPasswordReset, resetPassword } from "@/handlers/auth.handler";
const router = Router();

router.post("/login", login);
router.post("/register", register);
router.get("/me", authenticate, getMe);
router.post("/logout", logout);
router.post("/refresh", refreshToken);

router.post("/password/forgot", requestPasswordReset);
router.post("/password/reset", resetPassword);

export default router;
