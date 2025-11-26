// src/utils/topcv-auth.util.ts
import axios from "axios";

let topcvToken: string | null = null;
let tokenExpiry: number = 0;

export async function getTopCVAccessToken(): Promise<string> {
  if (topcvToken !== null && Date.now() < tokenExpiry) {
    return topcvToken;
  }

  try {
    const response = await axios.post(
      `${process.env.TOPCV_API_URL}/auth/login`,
      {
        email: process.env.TOPCV_SCHOOL_EMAIL,
        password: process.env.TOPCV_SCHOOL_PASSWORD,
      },
      { timeout: 5000 }
    );

    const { data } = response;
    if (!data?.success || !data.data?.access_token) {
      throw new Error("TopCV login failed: " + (data?.message || "Unknown error"));
    }

    const newToken = data.data.access_token;
    topcvToken = newToken;
    tokenExpiry = Date.now() + (data.data.expires_in ? data.data.expires_in * 1000 : 3600000);
    return newToken;
  } catch (error: any) {
    // console.error("TopCV login failed:", {
    //   message: error.message,
    //   response: error.response?.data,
    //   status: error.response?.status,
    //   url: `${process.env.TOPCV_API_URL}/auth/login`,
    //   email: process.env.TOPCV_SCHOOL_EMAIL,
    // });
    console.error("TopCV login error:", error.message);
    throw new Error("Failed to authenticate with TopCV");
  }
}
