import { createCompany, deleteCompany, getCompanies, getCompany, updateCompany } from "@/handlers/company.handler";
import { Router } from "express";

const router = Router();
router.get("/", getCompanies);
router.get("/:id", getCompany);
router.post("/", createCompany);
router.put("/:id", updateCompany);
router.delete("/:id", deleteCompany);

export default router;
