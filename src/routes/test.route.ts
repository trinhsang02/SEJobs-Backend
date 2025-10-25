// src/routes/test.route.ts
import { getTestStatus } from "@/handlers/test.handler";
import { Router } from "express";

const router = Router();

router.get("/status", getTestStatus);

export default router;
