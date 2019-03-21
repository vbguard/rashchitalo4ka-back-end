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
router.post("/register", users.postRegister);

// Login
router.post("/login", users.postLogin);

// User finance manipulation
router.get("/user/finance/:id", finance.getFinance);
router.post("/user/finance", finance.saveFinance);

router.use(notFoundHandler);
router.use(serverErrorHandler);

module.exports = router;
