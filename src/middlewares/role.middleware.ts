import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "@/utils/errors";
import { Database } from "@/types/database";

type UserRole = Database["public"]["Enums"]["role"];

export const requireRole = (requiredRole: UserRole) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== requiredRole) {
      throw new UnauthorizedError({
        message: `Access denied. Required role: ${requiredRole}`,
        status: "ROLE_MISMATCH",
      });
    }
    next();
  };
};
