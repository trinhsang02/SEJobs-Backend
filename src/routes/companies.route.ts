import { createCompany, deleteCompany, getCompanies, getCompany, updateCompany } from "@/handlers/company.handler";
import { getCompanyStats } from "@/handlers/company.stat.handler";
import { listJobsByCompany } from "@/handlers/jobs.handler";
import { authenticate } from "@/middlewares/auth.middleware";
import { authorizeRoles } from "@/middlewares/authorizeRoles";
import { Router } from "express";

const router = Router();
router.get("/", getCompanies);
router.get("/:id", getCompany);
router.post("/", authenticate, authorizeRoles("Employer"), createCompany);
router.put("/:id", authenticate, authorizeRoles("Employer"), updateCompany);
router.delete("/:id", deleteCompany);
router.get("/:id/jobs", listJobsByCompany);

router.get("/:id/stats", authenticate, authorizeRoles("Employer"), getCompanyStats);
export default router;
