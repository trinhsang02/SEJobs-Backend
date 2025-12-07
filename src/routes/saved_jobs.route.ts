import { Router } from "express";

import { authenticate } from "@/middlewares/auth.middleware";
// import { authorizeRoles } from "@/middlewares/authorizeRoles";
import { getSavedJobs, saveJob, unsaveJob } from "@/handlers/saved_jobs.handler";

const router = Router();

router.post("/", authenticate, saveJob);
router.delete("/:job_id", authenticate, unsaveJob);
router.get("/", authenticate, getSavedJobs);

export default router;
