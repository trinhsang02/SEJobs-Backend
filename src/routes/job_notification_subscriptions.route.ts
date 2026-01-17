import { Router } from "express";
import { authenticate } from "@/middlewares/auth.middleware";
import { authorizeRoles } from "@/middlewares/authorizeRoles";
import {
  getSubscriptionStatus,
  subscribe,
  unsubscribe,
  toggleSubscription,
} from "@/handlers/job_notification_subscriptions.handler";

const router = Router();

// All routes require authentication and Student role
router.use(authenticate);
router.use(authorizeRoles("Student"));

router.get("/", getSubscriptionStatus);

router.post("/", subscribe);

router.delete("/", unsubscribe);

router.put("/", toggleSubscription);

export default router;
