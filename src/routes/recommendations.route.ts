import { Router } from "express";
import RecommendationHandler from "@/handlers/recommendation.handler";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();
const handler = new RecommendationHandler();

/**
 * @swagger
 * /api/recommendations/jobs:
 *   get:
 *     summary: Gợi ý jobs cho student hiện tại
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Số lượng jobs gợi ý
 *     responses:
 *       200:
 *         description: Danh sách jobs được gợi ý
 *       401:
 *         description: Unauthorized
 */
router.get("/jobs", authenticate, handler.getRecommendedJobs);

/**
 * @swagger
 * /api/recommendations/jobs/custom:
 *   post:
 *     summary: Gợi ý jobs với custom weights
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               skills:
 *                 type: number
 *                 example: 0.5
 *               categories:
 *                 type: number
 *                 example: 0.3
 *               location:
 *                 type: number
 *                 example: 0.1
 *               salary:
 *                 type: number
 *                 example: 0.1
 *     responses:
 *       200:
 *         description: Danh sách jobs với custom weights
 */
router.post("/jobs/custom", authenticate, handler.getRecommendedJobsWithCustomWeights);

/**
 * @swagger
 * /api/recommendations/jobs/{jobId}/similar:
 *   get:
 *     summary: Tìm jobs tương tự
 *     tags: [Recommendations]
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Danh sách jobs tương tự
 *       400:
 *         description: Invalid job ID
 */
router.get("/jobs/:jobId/similar", handler.getSimilarJobs);

/**
 * @swagger
 * /api/recommendations/students/{jobId}:
 *   get:
 *     summary: Tìm students phù hợp với job (for company)
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Danh sách students phù hợp
 *       400:
 *         description: Invalid job ID
 */
router.get("/students/:jobId", authenticate, handler.getMatchingStudents);


/**
 * @swagger
 * /api/recommendations/jobs/with-topcv:
 *   get:
 *     summary: Gợi ý jobs bao gồm cả jobs từ TopCV
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Số lượng jobs gợi ý
 *     responses:
 *       200:
 *         description: Danh sách jobs từ database và TopCV
 *       401:
 *         description: Unauthorized
 */
router.get("/jobs/with-topcv", authenticate, handler.getRecommendedJobsWithTopCV);

export default router;
