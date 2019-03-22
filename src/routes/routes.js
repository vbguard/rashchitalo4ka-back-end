const express = require("express");
const router = express.Router();
const notFoundHandler = require("../middleware/not-found");
const serverErrorHandler = require("../middleware/server-error");
const { ensureAuthenticated } = require("../middleware/authCheck");

const finance = require("./finance");
const users = require("./users");

// Dashboard with checking user is authenticated?
router.get("/dashboard", ensureAuthenticated, (req, res) =>
  res.render("dashboard", {
    user: req.user
  })
);

// Register
/**
 * @swagger
 *
 * /register:
 *   post:
 *     tags:
 *       - Register
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                  type: string
 *               password:
 *                  type: string
 *               password2:
 *                  type: string
 *     responses:
 *       200:
 *         description: Return json with User data create
 *         schema:
 *           type: object
 *           properties:
 *             animals:
 *               type: array
 *               description: all the animals
 *               items:
 *                 type: string
 */
router.post("/register", users.postRegister);

// Login
/**
 * @swagger
 *
 * /login:
 *   post:
 *     description: Login to the application
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: username
 *         description: Username to use for login.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: User's password.
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: login
 */
router.post("/login", users.postLogin);

// User finance manipulation
router.get("/user/finance/:id", finance.getFinance);
router.post("/user/finance", finance.saveFinance);

router.use(notFoundHandler);
router.use(serverErrorHandler);

module.exports = router;
