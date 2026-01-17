import { Request, Response } from "express";
import AdminService from "@/services/admin.service";
import { UnauthorizedError } from "@/utils/errors";

export async function getAdminDashboard(req: Request, res: Response) {
  if (!req.user || req.user.role !== "Admin") {
    throw new UnauthorizedError({ message: "Admin access required" });
  }

  try {
    const dashboardData = await AdminService.getDashboardData();

    res.status(200).json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    console.error("Dashboard handler error:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch dashboard data",
    });
  }
}
