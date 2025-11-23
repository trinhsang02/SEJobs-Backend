// import { Request, Response } from "express";
// import axios from "axios";

// export async function listTopCVJobs(req: Request, res: Response) {
//   const { page = 1, per_page = 15, keyword, city_id, category_id, exp_id } = req.query;

//   const params = {
//     page,
//     per_page,
//     ...(keyword && { keyword }),
//     ...(city_id && { city_id }),
//     ...(category_id && { category_id }),
//     ...(exp_id && { exp_id }),
//   };

//   try {
//     const response = await axios.get(`${process.env.TOPCV_API_URL}/jobs`, {
//       params,
//       headers: {
//         "User-Agent":
//           "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
//         Referer: "https://job.phenikaa-uni.edu.vn/",
//         Origin: "https://job.phenikaa-uni.edu.vn",
//         Accept: "application/json, text/plain, */*",
//         "Accept-Language": "en-US,en;q=0.9,vi;q=0.8",
//         Connection: "keep-alive",
//         "Accept-Encoding": "identity",
//         Authorization: `Bearer ${process.env.TOPCV_API_TOKEN}`,
//       },
//       timeout: 5000,
//     });

//     const { data } = response;
//     if (!data.success) {
//       return res.status(502).json({
//         success: false,
//         message: data.message || "TopCV API error",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: data.data?.data || [],
//       pagination: {
//         total: data.data?.total || 0,
//         perPage: data.data?.perPage || per_page,
//         currentPage: data.data?.currentPage || page,
//       },
//     });
//   } catch (error: any) {
//     if (error.code === "ECONNABORTED") {
//       return res.status(504).json({
//         success: false,
//         message: "TopCV API timeout",
//       });
//     }
//     if (error.response) {
//       return res.status(error.response.status).json({
//         success: false,
//         message: error.response.data?.message || "TopCV API error",
//         error: error.response.data,
//       });
//     }
//     res.status(502).json({
//       success: false,
//       message: "Network error or TopCV unavailable",
//       error: error.message,
//     });
//   }
// }

// export async function getTopCVJobDetail(req: Request, res: Response) {
//   const { id } = req.params;
//   try {
//     const response = await axios.get(`${process.env.TOPCV_API_URL}/jobs/${id}`, {
//       headers: {
//         "User-Agent":
//           "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
//         Referer: "https://job.phenikaa-uni.edu.vn/",
//         Origin: "https://job.phenikaa-uni.edu.vn",
//         Accept: "application/json, text/plain, */*",
//         "Accept-Language": "en-US,en;q=0.9,vi;q=0.8",
//         Connection: "keep-alive",
//         "Accept-Encoding": "identity",
//         Authorization: `Bearer ${process.env.TOPCV_API_TOKEN}`,
//       },
//       timeout: 5000,
//     });
//     const { data } = response;
//     if (!data.success) {
//       return res.status(502).json({
//         success: false,
//         message: data.message || "TopCV API error",
//       });
//     }
//     res.status(200).json({
//       success: true,
//       data: data.data,
//     });
//   } catch (error: any) {
//     if (error.code === "ECONNABORTED") {
//       return res.status(504).json({
//         success: false,
//         message: "TopCV API timeout",
//       });
//     }
//     if (error.response) {
//       return res.status(error.response.status).json({
//         success: false,
//         message: error.response.data?.message || "TopCV API error",
//         error: error.response.data,
//       });
//     }
//     res.status(502).json({
//       success: false,
//       message: "Network error or TopCV unavailable",
//       error: error.message,
//     });
//   }
// }

// export async function getTopCVJobRecommend(req: Request, res: Response) {
//   const { email, page = 1, per_page = 20 } = req.query;
//   if (!email) {
//     return res.status(400).json({
//       success: false,
//       message: "Missing email parameter",
//     });
//   }
//   try {
//     const response = await axios.get(`${process.env.TOPCV_API_URL}/jobs/recommend`, {
//       params: { email, page, per_page },
//       headers: {
//         "User-Agent":
//           "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
//         Referer: "https://job.phenikaa-uni.edu.vn/",
//         Origin: "https://job.phenikaa-uni.edu.vn",
//         Accept: "application/json, text/plain, */*",
//         "Accept-Language": "en-US,en;q=0.9,vi;q=0.8",
//         Connection: "keep-alive",
//         "Accept-Encoding": "identity",
//         Authorization: `Bearer ${process.env.TOPCV_API_TOKEN}`,
//       },
//       timeout: 5000,
//     });
//     const { data } = response;
//     if (!data.success) {
//       return res.status(502).json({
//         success: false,
//         message: data.message || "TopCV API error",
//       });
//     }
//     res.status(200).json({
//       success: true,
//       data: data.data?.data || [],
//       pagination: {
//         total: data.data?.total || 0,
//         perPage: data.data?.perPage || per_page,
//         currentPage: data.data?.currentPage || page,
//       },
//     });
//   } catch (error: any) {
//     if (error.code === "ECONNABORTED") {
//       return res.status(504).json({
//         success: false,
//         message: "TopCV API timeout",
//       });
//     }
//     if (error.response) {
//       return res.status(error.response.status).json({
//         success: false,
//         message: error.response.data?.message || "TopCV API error",
//         error: error.response.data,
//       });
//     }
//     res.status(502).json({
//       success: false,
//       message: "Network error or TopCV unavailable",
//       error: error.message,
//     });
//   }
// }
