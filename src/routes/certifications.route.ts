import { Router } from "express";
import {
  getCertification,
  createCertification,
  updateCertification,
  deleteCertification,
  getCertificationsByStudentId,
  listCertifications,
} from "@/handlers/certifications.handler";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, getCertificationsByStudentId);
router.get("/:id", getCertification);
router.post("/", authenticate, createCertification);
router.put("/:id", authenticate, updateCertification);
router.delete("/:id", authenticate, deleteCertification);

export default router;
