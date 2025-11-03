/**
 * @openapi
 * components:
 *   schemas:
 *     Company:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         logo:
 *           type: string
 *           format: uri
 *         url:
 *           type: string
 *           format: uri
 *     Salary:
 *       type: object
 *       properties:
 *         from:
 *           type: number
 *         to:
 *           type: number
 *         text:
 *           type: string
 *         currency:
 *           type: string
 *     Job:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         external_id:
 *           type: integer
 *         url:
 *           type: string
 *           format: uri
 *         title:
 *           type: string
 *         company:
 *           $ref: '#/components/schemas/Company'
 *         salary:
 *           $ref: '#/components/schemas/Salary'
 *         locations:
 *           type: array
 *           items:
 *             type: string
 *         deadline:
 *           type: string
 *           format: date
 *         updated_at:
 *           type: string
 *         publish:
 *           type: string
 *     CreateJob:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         url:
 *           type: string
 *         company:
 *           $ref: '#/components/schemas/Company'
 *         category_id:
 *           type: integer
 *         experience_id:
 *           type: integer
 *         salary_from:
 *           type: number
 *         salary_to:
 *           type: number
 *         salary_text:
 *           type: string
 *         salary_currency:
 *           type: string
 *         locations:
 *           type: array
 *           items:
 *             type: string
 *
 */

/**
 * @openapi
 * /api/jobs:
 *   get:
 *     summary: List jobs with pagination and filters
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *       - in: query
 *         name: city_id
 *         schema:
 *           type: string
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: exp_id
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Paginated list of jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     perPage:
 *                       type: integer
 *                     currentPage:
 *                       type: integer
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Job'
 *
 */

/**
 * @openapi
 * /api/v1/jobs/{id}:
 *   get:
 *     summary: Get job by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Job object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Job'
 *       404:
 *         description: Job not found
 *
 */

/**
 * @openapi
 * /api/v1/jobs:
 *   post:
 *     summary: Create a new job (protected)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateJob'
 *     responses:
 *       201:
 *         description: Created job
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Job'
 *       400:
 *         description: Validation error
 *
 */

/**
 * @openapi
 * /api/v1/jobs/{id}:
 *   put:
 *     summary: Update job by ID (protected)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateJob'
 *     responses:
 *       200:
 *         description: Updated job
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Job'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Job not found
 *
 */

/**
 * @openapi
 * /api/v1/jobs/{id}:
 *   delete:
 *     summary: Delete job by ID (protected)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted job
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Job'
 *       404:
 *         description: Job not found
 *
 */

export default {};
