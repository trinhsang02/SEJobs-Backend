import { createCompanyType, deleteCompanyType, getCompanyType, getCompanyTypes, updateCompanyType } from "@/handlers/company_types.handler";
import { Router } from "express";

const router = Router();
router.get("/", getCompanyTypes);
router.get("/:id", getCompanyType);
router.post("/", createCompanyType);
router.put("/:id", updateCompanyType);
router.delete("/:id", deleteCompanyType);

export default router;
