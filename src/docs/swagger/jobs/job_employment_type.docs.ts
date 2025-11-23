/**
 * @swagger
 * tags:
 *   - name: JobEmploymentType
 *     description: Job Employment Type management
 */

/**
 * @swagger
 * /api/job-employment-types:
 *   get:
 *     tags: [JobEmploymentType]
 *     summary: Get all job employment types
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
 *         name: employment_type_ids
 *         schema:
 *           type: string
 *         description: Comma-separated employment type IDs
 *     responses:
 *       200:
 *         description: List of job employment types
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
 *                     $ref: '#/components/schemas/JobEmploymentType'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *   post:
 *     tags: [JobEmploymentType]
 *     summary: Create a job employment type
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateJobEmploymentType'
 *     responses:
 *       201:
 *         description: Job employment type created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/JobEmploymentType'
 * /api/job-employment-types/{id}:
 *   get:
 *     tags: [JobEmploymentType]
 *     summary: Get a job employment type by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Job employment type found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/JobEmploymentType'
 *   put:
 *     tags: [JobEmploymentType]
 *     summary: Update a job employment type
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
 *             $ref: '#/components/schemas/UpdateJobEmploymentType'
 *     responses:
 *       200:
 *         description: Job employment type updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/JobEmploymentType'
 *   delete:
 *     tags: [JobEmploymentType]
 *     summary: Delete a job employment type
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Job employment type deleted
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
 *     JobEmploymentType:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Full-time"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00Z"
 */
