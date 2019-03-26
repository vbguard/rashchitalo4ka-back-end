const bcrypt = require("bcrypt");
// const passport = require("passport");

// Load User model
const User = require("../models/User.model");
const UserFinance = require("../models/UserFinance.model");

// Register
module.exports.postRegister = (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];
  let userResp = {};

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
    res
      .status(406)
      .json({
        errors,
        name,
        email,
        path: "/register"
      })
      .redirect("/register");
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
                userResp.id = user._id;
                userResp.name = user.name;
                userResp.email = user.email;

                const newUserFinance = new UserFinance({
                  userId: user._id
                });

                newUserFinance.save().then(userFinance => {
                  userResp.finance = {
                    userFinanceId: userFinance._id,
                    userId: userFinance.userId,
                    data: userFinance.data
                  };
                  userResp.path = "/login";

                  req.flash(
                    "success_msg",
                    "You are now registered and can log in"
                  );
                  res.json(userResp).redirect("/login");
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
module.exports.postLogin = (req, res) => {
  // passport.authenticate("local", {
  //   successRedirect: "/dashboard",
  //   failureRedirect: "/login",
  //   failureFlash: true
  // })(req, res, next);
  console.log(req.isAuthenticated());
  res.status(200).send(req.user);
};

// Logout
module.exports.getLogout = (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.status(200).json({ path: "/login" });
  // .redirect("/login");
};
