const bcrypt = require("bcryptjs");
const passport = require("passport");

// Load User model
const User = require("../models/User.model");
const UserFinance = require("../models/UserFinance.model");

// Login Page
// router.get("/login", (req, res) => res.render("login"));

// Register Page
// router.get("/register", (req, res) => res.status(200).send("register"));

// Register
module.exports.postRegister = (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  console.log(req.body);

  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password !== password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.status(301).json({
      errors,
      name,
      email,
      path: "/register"
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: "Email already exists" });
        res.status(301).json({
          errors,
          name,
          email
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                const newUserFinance = new UserFinance({
                  userId: user._id
                });

                newUserFinance.save().then(userFinance => {
                  req.flash(
                    "success_msg",
                    "You are now registered and can log in"
                  );
                  res.json({ userData: user, userFinance, path: "/login" });
                });
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
};

// Login
module.exports.postLogin = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true
  })(req, res, next);
};

// Logout
module.exports.getLogout = (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res
    .status(200)
    .json({ path: "/login" })
    .redirect("/login");
};
