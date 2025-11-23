/**
 * @swagger
 * tags:
 *   - name: JobLevel
 *     description: Job Level management
 */

/**
 * @swagger
 * /api/job-levels:
 *   get:
 *     tags: [JobLevel]
 *     summary: Get all job levels
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Page size
 *       - in: query
 *         name: job_id
 *         schema:
 *           type: integer
 *         description: Filter by job ID
 *       - in: query
 *         name: job_level_ids
 *         schema:
 *           type: string
 *         description: Comma-separated job level IDs
 *     responses:
 *       200:
 *         description: List of job levels
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/JobLevel'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *   post:
 *     tags: [JobLevel]
 *     summary: Create a job level
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateJobLevel'
 *     responses:
 *       201:
 *         description: Job level created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/JobLevel'
 * /api/job-levels/{id}:
 *   get:
 *     tags: [JobLevel]
 *     summary: Get a job level by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Job level found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/JobLevel'
 *   put:
 *     tags: [JobLevel]
 *     summary: Update a job level
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
 *             $ref: '#/components/schemas/UpdateJobLevel'
 *     responses:
 *       200:
 *         description: Job level updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/JobLevel'
 *   delete:
 *     tags: [JobLevel]
 *     summary: Delete a job level
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Job level deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     JobLevel:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Senior"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00Z"
 */
