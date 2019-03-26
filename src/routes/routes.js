const express = require("express");
const router = express.Router();
const passport = require("passport");
const cors = require("cors");
const notFoundHandler = require("../middleware/not-found");
const serverErrorHandler = require("../middleware/server-error");
const { ensureAuthenticated } = require("../middleware/authCheck");
const config = require("../../config/config");

const UserController = require("../controllers/user");

const passportCheck = (req, res, next) =>
  passport.authenticate("jwt", {
    session: false,
    failWithError: true
  })(req, res, next);

const finance = require("./finance");

const setupCORSForDevelopment = developmentUrl => {
  const corsOptions = {
    origin: developmentUrl,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Content-Length",
      "X-Requested-With",
      "Accept"
    ],
    methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"]
  };

  router.use(cors(corsOptions));
};

if (process.env.NODE_ENV === "development") {
  const { client } = config;
  const developmentUrl = `${client.development.url}:${client.development.port}`;

  setupCORSForDevelopment(developmentUrl);
}

if (process.env.NODE_ENV === "production") {
  // Setup CORS for production
}

// Routes Not checked JWT

// Register
/**
 * @swagger
 *
 * /api/register:
 *   post:
 *     tags:
 *       - Register
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - email
 *              - password
 *              - name
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                  type: string
 *               password:
 *                  type: string
 *     responses:
 *       200:
 *         description: Return json with User data create
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: true
 *                message:
 *                  type: string
 *                  example: "Successfully created new user and his Finance Data. You can Login"
 *       400:
 *         description: If not correct data request
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: false
 *                message:
 *                  type: string
 *                  example: "some error written here"
 */
router.post("/register", UserController.userRegister);

// Login
/**
 * @swagger
 *
 * /api/login:
 *   post:
 *     tags:
 *       - Login
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - email
 *              - password
 *             properties:
 *               email:
 *                  type: string
 *                  example: "user@user.com"
 *               password:
 *                  type: string
 *                  example: "userPassword"
 *     responses:
 *       200:
 *         description: Return json with User data create
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                user:
 *                  type: object
 *                  example: {"id": "5c9962d4dee9ba402c2a86f9","email": "test@test.test","name": "Test Name"}
 *                token:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjOTk2MmQ0ZGVlOWJhNDAyYzJhODZmOSIsImVtYWlsIjoiM3YyaWt0bzN3d3I0QHRlc3R0a2hpcy5jb20iLCJuYW1lIjoiVGVzdCBTdXBlIiwiaWF0IjoxNTUzNTU2MzA2LCJleHAiOjE1NTM1NjYzMDZ9.I2V0TAlpJQdLz0x03gpfJpEPhR17MBvIyFzI3WuVXY4"
 *       400:
 *         description: If not correct data request
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  example: "Incorrect email or password."
 *                user:
 *                  type: boolean
 *                  example: false
 */
router.post("/login", UserController.userLogin);

router.post("/forgot", UserController.forgotPassword);
router.get("/reset/:token", UserController.resetPassword);

// Routes Must have checked function of JWT exp
/**
 * @swagger
 *
 * /api/logout:
 *    get:
 *     security:
 *        type: http
 *        scheme: bearer
 *        bearerFormat: JWT
 *     parameters:
 *            - in: header
 *              name: Authorization
 *              required: true
 *              schema:
 *                type: string
 *                example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjOTk2MmQ0ZGVlOWJhNDAyYzJhODZmOSIsImVtYWlsIjoiM3YyaWt0bzN3d3I0QHRlc3R0a2hpcy5jb20iLCJuYW1lIjoiVGVzdCBTdXBlIiwiaWF0IjoxNTUzNTU3NzI0LCJleHAiOjE1NTM1Njc3MjR9.Yuqy_d1NheW5osTAdzjSUrgAurZtXIZMjQnpTTufzhs"
 *              description: When you login write token to localStorage. Example - Bearer eyJhbGciOiJIUzI1N...
 *     tags:
 *       - Protected Routes
 *     responses:
 *       200:
 *         description: Return json with User data create
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: object
 *                  example: "User successfully logout"
 *       400:
 *         description: If not correct data request
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  example: "Incorrect email or password."
 *                user:
 *                  type: boolean
 *                  example: false
 */
router.get("/logout", passportCheck, UserController.userLogout);
router.put("/change", passportCheck, UserController.userChangePassword);
router.get("/user", passportCheck, UserController.getUser);
router.put("/user/:id", passportCheck, UserController.updateUser);
router.get("/data/:id", passportCheck, function(req, res) {
  res.status(200).json(req.user);
});

// Dashboard with checking user is authenticated?
router.get("/dashboard", ensureAuthenticated, (req, res) =>
  res.render("dashboard", {
    user: req.user
  })
);

// User finance manipulation
/**
 * @swagger
 *
 * /api/finance/{userId}:
 *    get:
 *     security:
 *        type: http
 *        scheme: bearer
 *        bearerFormat: JWT
 *     parameters:
 *            - in: header
 *              name: Authorization
 *              required: true
 *              schema:
 *                type: string
 *                example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjOTk2MmQ0ZGVlOWJhNDAyYzJhODZmOSIsImVtYWlsIjoiM3YyaWt0bzN3d3I0QHRlc3R0a2hpcy5jb20iLCJuYW1lIjoiVGVzdCBTdXBlIiwiaWF0IjoxNTUzNTU3NzI0LCJleHAiOjE1NTM1Njc3MjR9.Yuqy_d1NheW5osTAdzjSUrgAurZtXIZMjQnpTTufzhs"
 *              style: simple
 *     tags:
 *       - Protected Routes
 *     responses:
 *       200:
 *         description: Return json with User data create
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: true
 *                message:
 *                  type: object
 *                  example: "Data found with this ID"
 *                finance:
 *                  type: object
 *                  example: {"_id": "5c9396e2bc4e0d8ec4c45f64","data": [{"comments": "cool","_id": "5c93a50a9fd94d958fb18df1","dateEvent": "1994824666","typeEvent": "+","category": "Other","amountEvent": 205,"balanceAfter": 1293523},{}],"userId": "5c9396e2bc4e0d8ec4c45f63"}
 *       400:
 *         description: If not correct data request
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  example: "Not found finance data with this user ID"
 *                success:
 *                  type: boolean
 *                  example: false
 */
router.get("/finance/:userId", passportCheck, finance.getFinance);
router.post("/finance/:userId", passportCheck, finance.saveFinance);

router.use(notFoundHandler);
router.use(serverErrorHandler);

module.exports = router;
