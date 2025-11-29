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
 *         website_url:
 *           type: string
 *         company_id:
 *           type: integer
 *         company_branches_id:
 *           type: integer
 *         company:
 *           $ref: '#/components/schemas/Company'
 *         title:
 *           type: string
 *         responsibilities:
 *           type: array
 *           items:
 *             type: string
 *         requirement:
 *           type: array
 *           items:
 *             type: string
 *         nice_to_haves:
 *           type: array
 *           items:
 *             type: string
 *         benefit:
 *           type: array
 *           items:
 *             type: string
 *         working_time:
 *           type: string
 *         description:
 *           type: string
 *         apply_guide:
 *           type: string
 *         is_diamond:
 *           type: boolean
 *         is_job_flash_active:
 *           type: boolean
 *         is_hot:
 *           type: boolean
 *         salary_from:
 *           type: number
 *         salary_to:
 *           type: number
 *         salary_text:
 *           type: string
 *         salary_currency:
 *           type: string
 *         job_posted_at:
 *           type: string
 *         job_deadline:
 *           type: string
 *         apply_reasons:
 *           type: array
 *           items:
 *             type: string
 *         status:
 *           type: string
 *         updated_at:
 *           type: string
 *         category_ids:
 *           type: array
 *           items:
 *             type: integer
 *         required_skill_ids:
 *           type: array
 *           items:
 *             type: integer
 *         employment_type_ids:
 *           type: array
 *           items:
 *             type: integer
 *         job_level_ids:
 *           type: array
 *           items:
 *             type: integer
 *     CreateJob:
 *       type: object
 *       properties:
 *         external_id:
 *           type: integer
 *         website_url:
 *           type: string
 *         company_id:
 *           type: integer
 *         company_branches_id:
 *           type: integer
 *         title:
 *           type: string
 *         responsibilities:
 *           type: array
 *           items:
 *             type: string
 *         requirement:
 *           type: array
 *           items:
 *             type: string
 *         nice_to_haves:
 *           type: array
 *           items:
 *             type: string
 *         benefit:
 *           type: array
 *           items:
 *             type: string
 *         working_time:
 *           type: string
 *         description:
 *           type: string
 *         apply_guide:
 *           type: string
 *         is_diamond:
 *           type: boolean
 *         is_job_flash_active:
 *           type: boolean
 *         is_hot:
 *           type: boolean
 *         salary_from:
 *           type: number
 *         salary_to:
 *           type: number
 *         salary_text:
 *           type: string
 *         salary_currency:
 *           type: string
 *         job_posted_at:
 *           type: string
 *         job_deadline:
 *           type: string
 *         apply_reasons:
 *           type: array
 *           items:
 *             type: string
 *         status:
 *           type: string
 *         category_ids:
 *           type: array
 *           items:
 *             type: integer
 *         required_skill_ids:
 *           type: array
 *           items:
 *             type: integer
 *         employment_type_ids:
 *           type: array
 *           items:
 *             type: integer
 *         job_level_ids:
 *           type: array
 *           items:
 *             type: integer
 */

/**
 * @openapi
 * /api/jobs:
 *   get:
 *     summary: List jobs with pagination and filters
 *     tags: [Jobs]
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
 *       - in: query
 *         name: sort_by
 *         description: Field to sort by. Allowed values id, title, job_posted_at, created_at, salary_from, company_id
 *         schema:
 *           type: string
 *           enum: [id, title, job_posted_at, created_at, salary_from, company_id]
 *       - in: query
 *         name: order
 *         description: Sort direction. asc for ascending, desc for descending. Defaults to desc
 *         schema:
 *           type: string
 *           enum: [asc, desc]
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
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Job'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         total:
 *                           type: integer
 *                         total_pages:
 *                           type: integer
 *   post:
 *     summary: Create a new job (protected)
 *     tags: [Jobs]
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
 * /api/jobs/{id}:
 *   get:
 *     summary: Get job by ID
 *     tags: [Jobs]
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
 *   put:
 *     summary: Update job by ID (protected)
 *     tags: [Jobs]
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
 *   delete:
 *     summary: Delete job by ID (protected)
 *     tags: [Jobs]
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
 */

export default {};
