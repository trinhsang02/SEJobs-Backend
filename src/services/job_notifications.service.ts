import studentRepository from "@/repositories/student.repository";
import jobRepository from "@/repositories/job.repository";
import jobNotificationSentRepository from "@/repositories/job_notifications_sent.repository";
import jobNotificationSubscriptionsRepository from "@/repositories/job_notification_subscriptions.repository";
import { EmailService } from "@/services/email.service";

// Type for student with joined user data
interface StudentWithUser {
  id: number;
  user_id: number;
  skills: string[] | null;
  desired_positions: string[] | null;
  users: {
    user_id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
}

export class JobNotificationService {
  /**
   * Check if student profile matches with job
   * @param studentSkills - array of student skills (e.g., ["React", "Node.js"])
   * @param desiredPositions - array of desired positions (e.g., ["Frontend Developer", "Full Stack"])
   * @param jobTitle - job title (e.g., "Frontend Developer")
   * @param jobRequiredSkills - array of required skills (e.g., ["React", "JavaScript"])
   * @returns true if there's any overlap
   */
  private matchesJob(
    studentSkills: string[] | null,
    desiredPositions: string[] | null,
    jobTitle: string,
    jobRequiredSkills: string[] | null
  ): boolean {
    const normalizedJobTitle = jobTitle.toLowerCase().trim();
    const normalizedJobSkills = (jobRequiredSkills || []).map((skill) => skill.toLowerCase().trim());

    // Check 1: Match desired_positions with job title
    if (desiredPositions && desiredPositions.length > 0) {
      const normalizedDesiredPositions = desiredPositions.map((pos) => pos.toLowerCase().trim());
      
      // Check if job title contains any desired position or vice versa
      const positionMatch = normalizedDesiredPositions.some((position) => {
        return normalizedJobTitle.includes(position) || position.includes(normalizedJobTitle);
      });
      
      if (positionMatch) {
        return true; // Match found via desired positions
      }
    }

    // Check 2: Match student skills with job required skills
    if (studentSkills && studentSkills.length > 0) {
      const normalizedStudentSkills = studentSkills.map((skill) => skill.toLowerCase().trim());
      
      // Check if any student skill matches job required skills
      const skillsMatch = normalizedStudentSkills.some((skill) => normalizedJobSkills.includes(skill));
      
      if (skillsMatch) {
        return true; // Match found via skills
      }
      
      // Also check if job title contains any of student's skills
      const titleSkillMatch = normalizedStudentSkills.some((skill) => normalizedJobTitle.includes(skill));
      
      if (titleSkillMatch) {
        return true; // Match found via skill in title
      }
    }

    return false; // No match found
  }

  /**
   * Process new job and send notifications to matching students
   */
  async processJobNotifications(jobId: number): Promise<{ sent: number; failed: number }> {
    let sent = 0;
    let failed = 0;

    try {
      // Get job details with company and skills using findOne
      const { job } = await jobRepository.findOne(jobId);
      if (!job) {
        console.error(`Job ${jobId} not found`);
        return { sent, failed };
      }

      // Extract skills from job.skills array (already populated by findOne)
      const requiredSkills = (job.skills || []).map((skill: any) => skill.name);

      // Get all active subscriptions (students who opted in)
      const subscribedStudentIds = await jobNotificationSubscriptionsRepository.findAllActive();

      if (!subscribedStudentIds || subscribedStudentIds.length === 0) {
        console.log(`No active job notification subscriptions`);
        return { sent, failed };
      }

      // Get students with skills/desired_positions who have subscribed
      const { data: students } = await studentRepository.findAll<StudentWithUser>({
        fields: "id, user_id, skills, desired_positions",
        student_ids: subscribedStudentIds,
      });

      if (!students || students.length === 0) {
        console.log(`No subscribed students found`);
        return { sent, failed };
      }

      // Process each student
      for (const student of students) {
        try {
          const studentId = student.id;
          const studentSkills = student.skills;
          const desiredPositions = student.desired_positions;
          
          // Access nested user data from the join
          const userData = student.users;
          const userEmail = userData?.email;
          const firstName = userData?.first_name;

          if (!userEmail) {
            console.warn(`Student ${studentId} has no email`);
            failed++;
            continue;
          }

          // Check if already sent notification
          const alreadySent = await jobNotificationSentRepository.findByJobAndStudent(jobId, studentId);
          if (alreadySent) {
            console.log(`Notification already sent to student ${studentId} for job ${jobId}`);
            continue;
          }

          // Check if profile matches (skills or desired positions)
          const matches = this.matchesJob(studentSkills, desiredPositions, job.title, requiredSkills);
          if (!matches) {
            console.log(`Student ${studentId} doesn't match job ${jobId} (skills/positions)`);
            continue;
          }

          // Send email
          await EmailService.sendJobNotification({
            email: userEmail,
            firstName: firstName || "User",
            job: {
              id: job.id,
              title: job.title,
              description: job.description || "",
              company: (job.company as any)?.name || "Unknown",
              companyLogo: (job.company as any)?.logo || null,
              salary_from: job.salary_from,
              salary_to: job.salary_to,
              salary_text: job.salary_text,
            },
          });

          // Record sent notification
          await jobNotificationSentRepository.create({
            job_id: jobId,
            student_id: studentId,
            email_address: userEmail,
          });

          sent++;
          console.log(`Sent job notification to ${userEmail}`);
        } catch (error) {
          console.error(`Error processing student ${student.id}:`, error);
          failed++;
        }
      }

      console.log(`Job notification processing complete: ${sent} sent, ${failed} failed`);
      return { sent, failed };
    } catch (error) {
      console.error("Error in processJobNotifications:", error);
      throw error;
    }
  }
}

export default new JobNotificationService();
