const express = require("express");
const createError = require("http-errors");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// swagger setup
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Management API",
      description:
        "This is the API documentation for the Task Management System. \n\nFor some reason i am unable to find why authoriazation header from Swagger is not getting passed to server, So please test routes requiring authorization header from postman or thunderclient.",
    },
    components: {
      parameters: {
        AuthorizationHeader: {
          name: "Authorization",
          in: "header",
          required: true,
          description: "Bearer token for authorization",
          schema: {
            type: "string",
          },
        },
      },
    },

    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}/`,
      },
    ],
  },
  apis: ["./app.js"],
};

const swaggerSpec = swaggerJsDoc(options);

app.use("/api_docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// routes
const userRoute = require("./routes/userRoute");
const taskRoute = require("./routes/taskRoute");
const { pollDatabaseAndSendMail } = require("./controller/taskController");

app.get("/", (req, res) => {
  res.send(
    `TASKYY API. find api docs at <a href='http://localhost:${
      process.env.PORT || 3000
    }/api_docs'>here</a>`
  );
});

app.get("/favicon.ico", (req, res) => res.status(204));

app.use("/user", userRoute);
app.use("/task", taskRoute);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Starting Server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// polling database every 30 minutes
pollDatabaseAndSendMail();
setInterval(() => {
  pollDatabaseAndSendMail();
}, 30 * 60 * 1000);

/**
 * @swagger
 * components:
 *   schemas:
 *     Users:
 *       type: object
 *       required:
 *         - id
 *         - full_name
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The unique ID of the user.
 *           example: "4a9be1e2-9c30-4b38-bce2-b48be7175f4c"
 *         full_name:
 *           type: string
 *           description: The name of the user.
 *           example: "John Doe"
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email address.
 *           example: "user@example.com"
 *         password:
 *           type: string
 *           format: password
 *           description: The user's password hash.
 *           example: "$2a$10$vY9l0ZyilEPBzMrQvx6KiuM5BzAkfeiJ.PhBwqmsDqmUHXcE05PYm"
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date and time when the user was created.
 *           example: "2023-10-21T10:10:00Z"
 *     Tasks:
 *       type: object
 *       required:
 *         - id
 *         - user_id
 *         - title
 *         - description
 *         - due_date
 *       properties:
 *         id:
 *           type: integer
 *           format: uuid
 *           description: The unique ID of the task.
 *           example: "e0ccec69-6c77-4c1d-8f59-f7572d65fec4"
 *         user_id:
 *           type: string
 *           format: uuid
 *           description: The unique ID of the user (foreign key).
 *           example: "4a9be1e2-9c30-4b38-bce2-b48be7175f4c"
 *         title:
 *           type: string
 *           description: The title of a task.
 *           example: "Do Homework."
 *         description:
 *           type: string
 *           description: The description of a task.
 *           example: "Need to complete my homework to feel good."
 *         complete:
 *           type: boolean
 *           description: holds value of the status of task i.e if it is completed or not.
 *           default: false
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date and time when the task was created.
 *           example: "2023-10-21T10:10:00Z"
 *         due_date:
 *           type: string
 *           format: date-time
 *           description: The date and time when the task must be completed.
 *           example: "2023-10-21T10:10:00Z"
 *         edited_at:
 *           type: string
 *           format: date-time
 *           description: The date and time when the task was edited.
 *           example: "2023-10-21T10:10:00Z"
 *         alerted_user:
 *           type: boolean
 *           description: Stores value to denote if the user is notified about this task via email if task is not complete before due_date.
 *           example: false
 *         completed_at:
 *           type: string
 *           format: date-time
 *           description: The date and time when the task is completed.
 *           example: "2023-10-21T10:10:00Z"
 *     Refreshtokens:
 *       type: object
 *       required:
 *         - id
 *         - user_id
 *         - token
 *       properties:
 *         id:
 *           type: integer
 *           format: uuid
 *           description: The unique ID of the token.
 *           example: "b6c707e8-4181-41a2-88bc-433c10f6551d"
 *         user_id:
 *           type: string
 *           format: uuid
 *           description: The unique ID of the user (foreign key).
 *           example: "4a9be1e2-9c30-4b38-bce2-b48be7175f4c"
 *         token:
 *           type: string
 *           description: users refresh token generated on login.
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNGE5YmUxZTItOWMzMC00YjM4LWJjZTItYjQ4YmU3MTc1ZjRjIiwiaWF0IjoxNzI5NTI1NjA5LCJleHAiOjE3MzAxMzA0MDl9.p5RFdMGA1_2P8wNZ7kZMx8w4xW-dxI2ZCnNUvKlG02c"
 * /api_docs:
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
 *     description: Registers a new user with **fullname, email and password**. **Please use real email address to receive email notification on task.**
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
 *               fullName:
 *                 type: string
 *                 format: text
 *                 example: "user one"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "strongPassword123"
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 * /user/login:
 *   post:
 *     summary: Logs user in.
 *     description: Loggs user in with **email and password**. Generates and sends refresh token **which will be stored in database** and access token **stores in client** on successful authentication. Both tokens are sent to client to handle smooth session management using jsonwebtoken. **Refresh token expiring in 7 days and access token expiring in 30 seconds.** On successful login the previous refresh token will be revoked i.e deleted from database.
 *     tags:
 *       - Users
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
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "strongPassword123"
 *     responses:
 *       200:
 *         description: User login successful
 *       401:
 *         description: Invalid credentials
 * /user/accessToken:
 *   post:
 *     summary: Regenerates new access token.
 *     description: Checks if the **refresh token is valid** and grants user with new access token which will again **expire in 30s.**
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 format: email
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNGE5YmUxZTItOWMzMC00YjM4LWJjZTItYjQ4YmU3MTc1ZjRjIiwiaWF0IjoxNzI5NTY4NzUwLCJleHAiOjE3MzAxNzM1NTB9.EFrWmkoWBySuAJGNbl0zhoo3tZaCKyVZnhjKELmN7lc"
 *     responses:
 *       200:
 *         description: Send new refresh token.
 *       401:
 *         description: Refresh token expired / Invalid.
 * /task:
 *   post:
 *     summary: Adds Task for user.
 *     description: Adds new Task for user.
 *     tags:
 *       - Tasks
 *     parameters:
 *       - $ref: '#/components/parameters/AuthorizationHeader'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - due_date
 *             properties:
 *               title:
 *                 type: string
 *                 format: text
 *                 example: "Complete this assessment."
 *               description:
 *                 type: string
 *                 format: email
 *                 example: "I need to complete this assessment"
 *               due_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-10-25T10:10:00Z"
 *     responses:
 *       200:
 *         description: Task created for user.
 *       400:
 *         description: Bad request.
 *       403:
 *         description: Access token expired. **You will need to request for new access Token.**
 *   get:
 *     summary: Get tasks for user.
 *     description: Gets every tasks for matching user_id for user.
 *     tags:
 *       - Tasks
 *     parameters:
 *       - $ref: '#/components/parameters/AuthorizationHeader'
 *     responses:
 *       200:
 *         description: Task retrived for user.
 *       400:
 *         description: Bad request.
 *       403:
 *         description: Access token expired. **You will need to request for new access Token.**
 * /task/{task_id}:
 *   get:
 *     summary: Get individual task for user using task_id.
 *     description: Gets specific task for user using the **task_id**.
 *     tags:
 *       - Tasks
 *     parameters:
 *       - $ref: '#/components/parameters/AuthorizationHeader'
 *       - name: task_id
 *         in: path
 *         required: true
 *         description: The ID of the task to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task retrieved for user.
 *       400:
 *         description: Bad request.
 *       403:
 *         description: Access token expired. **You will need to request a new access Token.**
 *       404:
 *         description: Requested task not found.
 *   put:
 *     summary: Edits user task.
 *     description: Updates user task using task_id. Checks if the task is changed and updates task if updated data is provided. Updates **title and description** and sets **edited_at** to **current time**
 *     tags:
 *       - Tasks
 *     parameters:
 *       - $ref: '#/components/parameters/AuthorizationHeader'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 format: text
 *                 example: "Complete this assessment."
 *               description:
 *                 type: string
 *                 format: email
 *                 example: "I need to complete this assessment before bed."
 *     responses:
 *       200:
 *         description: Task created for user.
 *       400:
 *         description: Bad request.
 *       403:
 *         description: Access token expired. **You will need to request for new access Token.**
 *       404:
 *         description: Requested Task not found.
 *   patch:
 *     summary: update completion status of user.
 *     description: update specefic task for user using the **task_id. sets task to complete if not completed and vice versa. Polls database immediately if task completion is set to false, sets tasks alerted_user to false to send email reminding task upcoming within 30 minutes. Sets completed_at to current time on task completion**
 *     tags:
 *       - Tasks
 *     parameters:
 *       - $ref: '#/components/parameters/AuthorizationHeader'
 *       - name: task_id
 *         in: path
 *         required: true
 *         description: The ID of the task to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task status updated for user.
 *       400:
 *         description: Bad request.
 *       403:
 *         description: Access token expired. **You will need to request a new access Token.**
 *       404:
 *         description: Requested Task not found.
 *   delete:
 *     summary: Delete individual task for user using task_id.
 *     description: Delete specific task for user using the **task_id**.
 *     tags:
 *       - Tasks
 *     parameters:
 *       - $ref: '#/components/parameters/AuthorizationHeader'
 *       - name: task_id
 *         in: path
 *         required: true
 *         description: The ID of the task to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task Deleted for user.
 *       400:
 *         description: Bad request.
 *       403:
 *         description: Access token expired. **You will need to request a new access Token.**
 *       404:
 *         description: Requested Taks not found.
 */
