import { Request, Response } from "express";
import axios from "axios";
import { getTopCVAccessToken } from "@/utils/topcv-auth";
import { MY_PROVINCE_ID_TO_TOPCV_ID } from "@/utils/cityMapper";
import { getPrimaryTopCVCategory } from "@/utils/categoryMapper";

export async function listTopCVJobs(req: Request, res: Response) {
  const token = await getTopCVAccessToken();
  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const per_page = Math.min(100, Math.max(1, parseInt(req.query.per_page as string, 10) || 15));
  const { keyword, city_id, province_ids, category_ids, exp_id } = req.query;

  // City
  let finalCityId: string | undefined;
  if (city_id) {
    finalCityId = city_id as string;
  } else if (province_ids) {
    const provId = parseInt(province_ids as string, 10);
    const topCvCityId = MY_PROVINCE_ID_TO_TOPCV_ID[provId];
    if (topCvCityId) {
      finalCityId = topCvCityId.toString();
    }
  }

  // Category
  let finalCategoryId: string | undefined;

  const myCatIds = (category_ids as string)
    .split(",")
    .map((id) => parseInt(id.trim(), 10))
    .filter((id) => !isNaN(id));

  if (myCatIds.length >= 1) {
    const firstId = myCatIds[0];
    if (firstId !== undefined) {
      const primaryCat = getPrimaryTopCVCategory(firstId);
      if (primaryCat) {
        finalCategoryId = primaryCat.id.toString();
      }
    }
  }

  const params = {
    page,
    per_page,
    ...(keyword && { keyword }),
    ...(finalCityId && { city_id: finalCityId }),
    ...(finalCategoryId && { category_id: finalCategoryId }),
    ...(exp_id && { exp_id }),
  };

  try {
    const response = await axios.get(`${process.env.TOPCV_JOBS_URL}`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 5000,
    });

    const { data } = response;
    if (!data.success) {
      return res.status(502).json({
        success: false,
        message: data.message || "TopCV API error",
      });
    }

    res.status(200).json({
      success: true,
      data: data.data?.data || [],
      pagination: {
        total: data.data?.total || 0,
        perPage: data.data?.perPage || per_page,
        currentPage: data.data?.currentPage || page,
      },
    });
  } catch (error: any) {
    if (error.code === "ECONNABORTED") {
      return res.status(504).json({
        success: false,
        message: "TopCV API timeout",
      });
    }
    if (error.response) {
      console.error("TopCV API error:", {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
      });
    }
    res.status(502).json({
      success: false,
      message: "Network error or TopCV unavailable",
    });
  }
}

export async function getTopCVJobDetail(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const token = await getTopCVAccessToken();
    const response = await axios.get(`${process.env.TOPCV_JOBS_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 5000,
    });
    const { data } = response;
    if (!data.success) {
      return res.status(502).json({
        success: false,
        message: data.message || "TopCV API error",
      });
    }
    res.status(200).json({
      success: true,
      data: data.data,
    });
  } catch (error: any) {
    if (error.code === "ECONNABORTED") {
      return res.status(504).json({
        success: false,
        message: "TopCV API timeout",
      });
    }
    if (error.response) {
      console.error("TopCV API error:", {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
      });
    }
    res.status(502).json({
      success: false,
      message: "Network error or TopCV unavailable",
    });
  }
}

export async function getTopCVJobRecommend(req: Request, res: Response) {
  const { email, page = 1, per_page = 20, city_id, province_id } = req.query;
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Missing email parameter",
    });
  }

  let finalCityId: string | undefined;
  if (city_id) {
    finalCityId = city_id as string;
  } else if (province_id) {
    const provId = parseInt(province_id as string, 10);
    const topCvCityId = MY_PROVINCE_ID_TO_TOPCV_ID[provId];
    if (topCvCityId) {
      finalCityId = topCvCityId.toString();
    }
  }

  const params: Record<string, any> = { email, page, per_page };
  if (finalCityId) params.city_id = finalCityId;

  try {
    const token = await getTopCVAccessToken();
    const response = await axios.get(`${process.env.TOPCV_JOBS_URL}/recommend`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 5000,
    });
    const { data } = response;
    if (!data.success) {
      return res.status(502).json({
        success: false,
        message: data.message || "TopCV API error",
      });
    }
    res.status(200).json({
      success: true,
      data: data.data?.data || [],
      pagination: {
        total: data.data?.total || 0,
        perPage: data.data?.perPage || per_page,
        currentPage: data.data?.currentPage || page,
      },
    });
  } catch (error: any) {
    if (error.code === "ECONNABORTED") {
      return res.status(504).json({
        success: false,
        message: "TopCV API timeout",
      });
    }
    if (error.response) {
      console.error("TopCV API error:", {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
      });
    }
    res.status(502).json({
      success: false,
      message: "Network error or TopCV unavailable",
    });
  }
}
