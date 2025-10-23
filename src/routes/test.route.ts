// src/routes/test.route.ts
import { Router } from "express";
import { getTestStatus } from "../handlers/test.handler";

const router = Router();

router.get("/status", getTestStatus);

export default router;
