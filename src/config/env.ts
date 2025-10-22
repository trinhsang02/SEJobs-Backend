// src/config/env.ts
import dotenv from "dotenv";

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  SUPABASE_URL: process.env.SUPABASE_URL!,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
  // the 2 supabase are undefined right now
  JWT_SECRET: process.env.JWT_SECRET,
};

// Validate required env vars
if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY || !env.JWT_SECRET) {
  throw new Error("Missing required environment variables");
}
