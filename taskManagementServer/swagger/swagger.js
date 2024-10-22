const swaggerJsDoc = require("swagger-jsdoc");

// swagger setup
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Management API",
      description:
        "This is the API documentation for the Task Management System.",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}/`,
      },
    ],
  },
  apis: ["./app.js"],
};

module.exports.swaggerSpec = swaggerJsDoc(options);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Swagger UI.
 *     description: Returns a default Swagger UI for APIS.
 *     tags:
 *       - Swagger UI
 *     responses:
 *       200:
 *         description: Successful response.
 * /user:
 *   post:
 *     summary: Register User
 *     description: Registers a new user with email and password.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The user's password
 *                 example: "strongPassword123"
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User registered"
 *       400:
 *         description: Invalid input (e.g., missing or invalid email/password)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid email or password"
 */
