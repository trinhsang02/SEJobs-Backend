// src/handlers/test.handler.ts
import { Request, Response } from "express";
import { testSupabaseConnection } from "../services/test.service";

export const getTestStatus = async (req: Request, res: Response) => {
  try {
    const result = await testSupabaseConnection();
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error during test",
    });
  }
};
