import { createBranch, deleteBranch, getCompanyBranch, getCompanyBranches, updateBranch } from "@/handlers/company_branches.handler";
import { authenticate } from "@/middlewares/auth.middleware";
import { authorizeRoles } from "@/middlewares/authorizeRoles";
import e, { Router } from "express";

const router = Router();

router.get("/", getCompanyBranches);
router.get("/:id", getCompanyBranch);
router.post("/", authenticate, authorizeRoles("Employer"), createBranch);
router.put("/:id", authenticate, authorizeRoles("Employer"), updateBranch);
router.delete("/:id", authenticate, authorizeRoles("Employer"), deleteBranch);

export default router;