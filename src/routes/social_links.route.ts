import { Router } from "express";
import { authenticate } from "@/middlewares/auth.middleware";
import { createSocialLink, updateSocialLink, deleteSocialLink, listSocialLinks } from "@/handlers/social_links.handler";

const router = Router();

router.use(authenticate);

router.post("/", createSocialLink);
router.get("/", listSocialLinks);
router.put("/:platform", updateSocialLink);
router.delete("/:platform", deleteSocialLink);

export default router;
