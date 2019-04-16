const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const morgan = require("morgan");

const swaggerDoc = require("../swagger/swaggerDoc");
const routes = require("../../routes/routes");
const app = express();

// Passport Config
require("../passport/passport")(passport);

// Get url to server MongoDB
const dbUrl = require("../../../config/config").MondoDB.url;

// Connect to MongoDB
mongoose
  .connect(dbUrl, { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Logger - see connection in/out
app.use(morgan("dev"));

// Express json parse
app.use(express.json());

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: "secret cat",
    resave: false,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/", express.static("public"));
app.use("/registration", express.static("public"));
app.use("/login", express.static("public"));
app.use("/dashboard", express.static("public"));
app.use("/dashboard/currency", express.static("public"));
app.use("/dashboard/diagram", express.static("public"));
swaggerDoc(app);

// Connecting All API Routes
app.use("/api", routes);

// Get PORT for Express App
const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
