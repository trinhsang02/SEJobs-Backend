import {
  createCompanyType,
  deleteCompanyType,
  getCompanyType,
  getCompanyTypes,
  updateCompanyType,
} from "@/handlers/company_types.handler";
import { authorizeRoles } from "@/middlewares/authorizeRoles";
import { Router } from "express";

const router = Router();
router.get("/", getCompanyTypes);
router.get("/:id", getCompanyType);
router.post("/", authorizeRoles("Admin", "Manager"), createCompanyType);
router.put("/:id", authorizeRoles("Admin", "Manager"), updateCompanyType);
router.delete("/:id", authorizeRoles("Admin", "Manager"), deleteCompanyType);

export default router;
