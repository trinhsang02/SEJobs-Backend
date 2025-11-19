import { getProvinces, getWards } from "@/handlers/address.handler";
import { Router } from "express";

const router = Router();

router.get("/provinces", getProvinces);
router.get("/provinces/:provinceId/wards", getWards);

export default router;
