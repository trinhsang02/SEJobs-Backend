import { deleteMedia, uploadMedia, uploadMultiMedia } from "@/handlers/media.handler";
import { upload } from "@/middlewares/upload.middleware";
import { Router } from "express";
const router = Router();

router.post("/upload", upload.single("file"), uploadMedia);
router.post("/uploads", upload.array("files", 5), uploadMultiMedia);

router.delete("/delete/:fileName", deleteMedia);

export default router;
