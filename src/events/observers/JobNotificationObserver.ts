import { appEventEmitter, AppEvents, JobCreatedPayload } from "@/events/EventEmitter";
import jobNotificationService from "@/services/job_notifications.service";

/**
 * Observer for Job Creation Events
 * Sends email notifications to matching students
 */
class JobNotificationObserver {
  constructor() {
    this.subscribe();
  }

  private subscribe() {
    // Listen to job creation events
    appEventEmitter.on(AppEvents.JOB_CREATED, this.handleJobCreated.bind(this));
    console.log("JobNotificationObserver subscribed to JOB_CREATED event");
  }

  private async handleJobCreated(payload: JobCreatedPayload): Promise<void> {
    try {
      console.log(`JobNotificationObserver: Processing job ${payload.jobId}`);
      
      const result = await jobNotificationService.processJobNotifications(payload.jobId);
      
      console.log(`Job notifications sent: ${result.sent} successful, ${result.failed} failed`);
    } catch (error) {
      console.error("Error in JobNotificationObserver:", error);
    }
  }
}

// Initialize observer
export default new JobNotificationObserver();
