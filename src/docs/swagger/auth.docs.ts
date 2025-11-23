/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: User's password (must contain uppercase, lowercase, number, special character)
 *     responses:
 *       200:
 *         description: Login successful, authentication cookies set
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *             description: access_token and refresh_token cookies are set for authentication
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
 *                     user:
 *                       type: object
 *                       properties:
 *                         user_id:
 *                           type: integer
 *                         email:
 *                           type: string
 *                           format: email
 *                         first_name:
 *                           type: string
 *                         last_name:
 *                           type: string
 *                         avatar:
 *                           type: string
 *                           nullable: true
 *                         role:
 *                           type: string
 *                         is_verified:
 *                           type: boolean
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                         updated_at:
 *                           type: string
 *                           format: date-time
 *       400:
 *         description: Invalid credentials
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - first_name
 *               - last_name
 *               - password
 *               - confirm_password
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               first_name:
 *                 type: string
 *                 description: User's first name
 *               last_name:
 *                 type: string
 *                 description: User's last name
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: Password (must contain uppercase, lowercase, number, special character)
 *               confirm_password:
 *                 type: string
 *                 format: password
 *                 description: Must match password field
 *               role:
 *                 type: string
 *                 enum: [Student, Employer, Manager, Admin]
 *                 description: User role
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input or passwords don't match
 *       409:
 *         description: Email already exists
 */

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 email:
 *                   type: string
 *                   format: email
 *                 first_name:
 *                   type: string
 *                 last_name:
 *                   type: string
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user (clears authentication cookies)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful, cookies cleared
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *             description: access_token and refresh_token cookies are cleared
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     CookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: access_token
 */
