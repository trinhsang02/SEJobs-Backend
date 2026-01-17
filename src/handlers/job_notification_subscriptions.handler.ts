import { Request, Response } from "express-serve-static-core";
import jobNotificationSubscriptionsRepository from "@/repositories/job_notification_subscriptions.repository";
import studentRepository from "@/repositories/student.repository";
import { NotFoundError } from "@/utils/errors";

/**
 * Get subscription status for current user
 */
export async function getSubscriptionStatus(req: Request, res: Response) {
  const userId = req.user!.userId;

  // Find student by user_id
  const student = await studentRepository.findOne({ user_id: userId });
  if (!student) {
    throw new NotFoundError({ message: "Student profile not found" });
  }

  const subscription = await jobNotificationSubscriptionsRepository.findByStudentId(student.id);

  res.status(200).json({
    success: true,
    data: {
      is_subscribed: subscription?.is_active || false,
      subscription: subscription || null,
    },
  });
}

/**
 * Subscribe to job notifications
 */
export async function subscribe(req: Request, res: Response) {
  const userId = req.user!.userId;

  // Find student by user_id
  const student = await studentRepository.findOne({ user_id: userId });
  if (!student) {
    throw new NotFoundError({ message: "Student profile not found" });
  }

  // Upsert subscription (create or update to active)
  const subscription = await jobNotificationSubscriptionsRepository.upsert({
    student_id: student.id,
    is_active: true,
  });

  res.status(200).json({
    success: true,
    message: "Successfully subscribed to job notifications",
    data: subscription,
  });
}

/**
 * Unsubscribe from job notifications
 */
export async function unsubscribe(req: Request, res: Response) {
  const userId = req.user!.userId;

  // Find student by user_id
  const student = await studentRepository.findOne({ user_id: userId });
  if (!student) {
    throw new NotFoundError({ message: "Student profile not found" });
  }

  // Check if subscription exists
  const existing = await jobNotificationSubscriptionsRepository.findByStudentId(student.id);
  if (!existing) {
    res.status(200).json({
      success: true,
      message: "Already unsubscribed",
    });
    return;
  }

  // Update to inactive
  await jobNotificationSubscriptionsRepository.update(student.id, {
    is_active: false,
  });

  res.status(200).json({
    success: true,
    message: "Successfully unsubscribed from job notifications",
  });
}

/**
 * Toggle subscription status
 */
export async function toggleSubscription(req: Request, res: Response) {
  const userId = req.user!.userId;
  const { is_active } = req.body;

  // Find student by user_id
  const student = await studentRepository.findOne({ user_id: userId });
  if (!student) {
    throw new NotFoundError({ message: "Student profile not found" });
  }

  // Upsert subscription
  const subscription = await jobNotificationSubscriptionsRepository.upsert({
    student_id: student.id,
    is_active: is_active !== undefined ? is_active : true,
  });

  res.status(200).json({
    success: true,
    message: `Job notifications ${subscription.is_active ? "enabled" : "disabled"}`,
    data: subscription,
  });
}
