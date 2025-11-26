import { Router } from "express";
import { getTopCVJobDetail, getTopCVJobRecommend, listTopCVJobs } from "@/handlers/topcv.handler";

const router = Router();

router.get("/jobs", listTopCVJobs);
router.get("/jobs/recommend", getTopCVJobRecommend);
router.get("/jobs/:id", getTopCVJobDetail);

export default router;
