import { createCompany, deleteCompany, getCompanies, getCompany, updateCompany } from "@/handlers/company.handler";
import { listJobsByCompany } from "@/handlers/jobs.handler";
import { Router } from "express";

const router = Router();
router.get("/", getCompanies);
router.get("/:id", getCompany);
router.post("/", createCompany);
router.put("/:id", updateCompany);
router.delete("/:id", deleteCompany);
router.get("/:id/jobs", listJobsByCompany);

export default router;
