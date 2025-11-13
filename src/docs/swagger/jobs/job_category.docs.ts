/**
 * @swagger
 * tags:
 *   - name: JobCategory
 *     description: Job Category management
 */

/**
 * @swagger
 * /api/job-categories:
 *   get:
 *     tags: [JobCategory]
 *     summary: Get all job categories
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
 *         name: category_ids
 *         schema:
 *           type: string
 *         description: Comma-separated category IDs
 *     responses:
 *       200:
 *         description: List of job categories
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
 *                     $ref: '#/components/schemas/JobCategory'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *   post:
 *     tags: [JobCategory]
 *     summary: Create a job category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateJobCategory'
 *     responses:
 *       201:
 *         description: Job category created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/JobCategory'
 * /api/job-categories/{id}:
 *   get:
 *     tags: [JobCategory]
 *     summary: Get a job category by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Job category found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/JobCategory'
 *   put:
 *     tags: [JobCategory]
 *     summary: Update a job category
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
 *             $ref: '#/components/schemas/UpdateJobCategory'
 *     responses:
 *       200:
 *         description: Job category updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/JobCategory'
 *   delete:
 *     tags: [JobCategory]
 *     summary: Delete a job category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Job category deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 */
