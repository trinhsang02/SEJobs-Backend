import _ from "lodash";
import userRepository from "@/repositories/user.repository";
import companyRepository from "@/repositories/company.repository";
import jobRepository from "@/repositories/job.repository";
import applicationRepository from "@/repositories/application.repository";
import { JobStatus } from "@/types/common";
import { BadRequestError } from "@/utils/errors";

interface UserInfo {
  user_id: number;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  updated_at?: string | null;
}

interface CompanyInfo {
  id: number;
  name: string;
  updated_at?: string;
}

interface JobInfo {
  id: number;
  title: string;
  created_at: string;
  company_id: number;
}

interface ApplicationInfo {
  id: number;
  submitted_at: string;
  user_id: number;
  job_id: number;
  company_id: number;
}

export class AdminService {
  static async getDashboardData() {
    try {
      const [
        totalStudents,
        totalCompanies,
        activeJobs,
        totalApplications,
        activeUsers,
        pendingReviews,
        recentActivities,
        topCompanies,
      ] = await Promise.all([
        this.getTotalStudents(),
        this.getTotalCompanies(),
        this.getActiveJobs(),
        this.getTotalApplications(),
        this.getActiveUsers(),
        this.getPendingReviews(),
        this.getRecentActivities(),
        this.getTopCompanies(),
      ]);

      return {
        stats: {
          totalStudents: this.formatNumber(totalStudents),
          totalCompanies: this.formatNumber(totalCompanies),
          activeJobs: this.formatNumber(activeJobs),
          totalApplications: this.formatNumber(totalApplications),
          activeUsers: this.formatNumber(activeUsers),
          pendingReviews: this.formatNumber(pendingReviews),
          changes: {
            totalStudents: "+12.5%",
            totalCompanies: "+8.2%",
            activeJobs: "+23.1%",
            totalApplications: "+15.3%",
            activeUsers: "+5.7%",
            pendingReviews: "-3.2%",
          },
        },
        recentActivities,
        topCompanies,
      };
    } catch (error) {
      console.error("Error in AdminService.getDashboardData:", error);
      throw new BadRequestError({ message: "Failed to fetch dashboard data" });
    }
  }

  private static formatNumber(num: number): string {
    return num.toLocaleString();
  }

  private static async getTotalStudents(): Promise<number> {
    const { data: users } = await userRepository.findAll({
      fields: "user_id, role, is_active",
    });

    return (users as UserInfo[]).filter((user) => user.role === "Student" && user.is_active === true).length;
  }

  private static async getTotalCompanies(): Promise<number> {
    const { pagination } = await companyRepository.findAll({
      page: 1,
      limit: 1,
      fields: "id",
    });
    return pagination && typeof pagination === "object" ? (pagination as any).total || 0 : 0;
  }

  private static async getActiveJobs(): Promise<number> {
    const { pagination } = await jobRepository.findAll({
      page: 1,
      limit: 1,
      fields: "id",
      statuses: ["Approved"] as JobStatus[],
    });
    return pagination && typeof pagination === "object" ? (pagination as any).total || 0 : 0;
  }

  private static async getTotalApplications(): Promise<number> {
    const { pagination } = await applicationRepository.findAll({
      page: 1,
      limit: 1,
      fields: "id",
    });
    return pagination && typeof pagination === "object" ? (pagination as any).total || 0 : 0;
  }

  private static async getActiveUsers(): Promise<number> {
    const { data: users } = await userRepository.findAll({
      fields: "user_id, is_active",
    });

    return (users as UserInfo[]).filter((user) => user.is_active === true).length;
  }

  private static async getPendingReviews(): Promise<number> {
    const { pagination } = await jobRepository.findAll({
      page: 1,
      limit: 1,
      fields: "id",
      statuses: ["Pending"] as JobStatus[],
    });
    return pagination && typeof pagination === "object" ? (pagination as any).total || 0 : 0;
  }

  private static async getRecentActivities() {
    try {
      const { data: recentApplications } = await applicationRepository.findAll({
        page: 1,
        limit: 10,
        fields: "id, submitted_at, user_id, job_id, company_id",
        sort_by: "submitted_at" as any,
        order: "desc" as any,
      });

      const { data: recentJobs } = await jobRepository.findAll({
        page: 1,
        limit: 10,
        fields: "id, title, created_at, company_id",
        statuses: ["Approved", "Pending"] as JobStatus[],
        sort_by: "created_at",
        order: "desc",
      });

      const { data: allUsers } = await userRepository.findAll({
        fields: "user_id, first_name, last_name, updated_at, role",
      });

      const students = (allUsers as UserInfo[]).filter((user) => user.role === "Student");
      const recentStudentUpdates = students
        .filter((user) => user.updated_at)
        .sort((a, b) => new Date(b.updated_at!).getTime() - new Date(a.updated_at!).getTime())
        .slice(0, 10);

      const companyIds = [
        ...new Set([
          ...recentApplications.map((app) => app.company_id).filter((id) => id),
          ...recentJobs.map((job) => job.company_id).filter((id) => id),
        ]),
      ].map((id) => Number(id));

      let companies: CompanyInfo[] = [];
      if (companyIds.length > 0) {
        const { data: companiesData } = await companyRepository.findAll({
          page: 1,
          limit: companyIds.length,
          fields: "id, name",
          company_ids: companyIds as number[],
        });
        companies = companiesData as CompanyInfo[];
      }

      const companiesMap = _.keyBy(companies, "id");

      const userIds = [
        ...new Set([
          ...recentApplications.map((app) => app.user_id).filter((id) => id),
          ...recentStudentUpdates.map((user) => user.user_id).filter((id) => id),
        ]),
      ].map((id) => Number(id));

      let users: UserInfo[] = [];
      if (userIds.length > 0) {
        const userResults = await Promise.all(
          userIds.map(async (userId) => {
            try {
              const user = await userRepository.findOne({ user_id: userId });
              return user;
            } catch (error) {
              console.error(`Error fetching user ${userId}:`, error);
              return null;
            }
          }),
        );

        users = userResults
          .filter((user) => user !== null)
          .map((user) => ({
            user_id: (user as any).user_id,
            first_name: (user as any).first_name,
            last_name: (user as any).last_name,
            role: (user as any).role,
            is_active: (user as any).is_active,
            updated_at: (user as any).updated_at,
          }));
      }

      const usersMap = _.keyBy(users, "user_id");

      const jobIds = recentApplications
        .map((app) => app.job_id)
        .filter((id) => id)
        .map((id) => Number(id));

      let jobs: JobInfo[] = [];
      if (jobIds.length > 0) {
        const jobResults = await Promise.all(
          jobIds.map(async (jobId) => {
            try {
              const result = await jobRepository.findOne(jobId);
              return result?.job || null;
            } catch (error) {
              console.error(`Error fetching job ${jobId}:`, error);
              return null;
            }
          }),
        );

        jobs = jobResults
          .filter((job) => job !== null)
          .map((job) => ({
            id: (job as any).id,
            title: (job as any).title,
            created_at: (job as any).created_at,
            company_id: (job as any).company_id,
          }));
      }

      const jobsMap = _.keyBy(jobs, "id");

      const activities = [
        ...recentApplications.slice(0, 5).map((app) => {
          const user = usersMap[app.user_id] || { first_name: "Unknown", last_name: "User" };
          const job = jobsMap[app.job_id] || { title: "Unknown Job" };
          const company = app.company_id
            ? companiesMap[app.company_id] || { name: "Unknown Company" }
            : { name: "Unknown Company" };

          return {
            user: `${user.first_name} ${user.last_name}`,
            action: `applied to "${job.title}" position`,
            company: company.name,
            time: this.formatTimeAgo(app.submitted_at),
          };
        }),

        ...recentJobs.slice(0, 5).map((job) => {
          const company = job.company_id
            ? companiesMap[job.company_id] || { name: "Unknown Company" }
            : { name: "Unknown Company" };

          return {
            user: company.name,
            action: `posted new job listing: "${job.title}"`,
            company: company.name,
            time: this.formatTimeAgo(job.created_at),
          };
        }),

        ...recentStudentUpdates.slice(0, 5).map((student) => {
          return {
            user: `${student.first_name} ${student.last_name}`,
            action: "updated profile and CV",
            company: null,
            time: this.formatTimeAgo(student.updated_at),
          };
        }),
      ];

      return activities
        .filter((activity) => activity.time && activity.time !== "Invalid date")
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, 5);
    } catch (error) {
      console.error("Error in getRecentActivities:", error);
      return [];
    }
  }

  private static async getTopCompanies() {
    try {
      const { data: companies } = await companyRepository.findAll({
        fields: "id, name",
      });

      if (companies.length === 0) return [];

      const { data: jobs } = await jobRepository.findAll({
        fields: "id, company_id, status",
        statuses: ["Approved"] as JobStatus[],
      });

      const { data: applications } = await applicationRepository.findAll({
        fields: "id, job_id",
      });

      const jobsByCompany = _.groupBy(jobs, "company_id");
      const applicationsByJob = _.groupBy(applications, "job_id");

      const companyStats = (companies as CompanyInfo[]).map((company) => {
        const companyJobs = jobsByCompany[company.id] || [];
        const jobCount = companyJobs.length;

        let applicationCount = 0;
        companyJobs.forEach((job) => {
          const jobApps = applicationsByJob[job.id] || [];
          applicationCount += jobApps.length;
        });

        return {
          id: company.id,
          name: company.name,
          job_count: jobCount,
          application_count: applicationCount,
        };
      });

      return companyStats
        .sort((a, b) => b.application_count - a.application_count || b.job_count - a.job_count)
        .slice(0, 5)
        .map((c) => ({
          name: c.name,
          jobs: c.job_count,
          applications: c.application_count,
        }));
    } catch (error) {
      console.error("Error in getTopCompanies:", error);
      return [];
    }
  }

  private static formatTimeAgo(dateString: string | Date | null | undefined): string {
    if (!dateString) return "Unknown time";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return "just now";
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  }
}

export default AdminService;
