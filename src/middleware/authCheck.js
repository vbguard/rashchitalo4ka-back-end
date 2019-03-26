module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      console.log("user PASS");
      return next();
    }
    console.log("user not pass");
    req.flash("error_msg", "Please log in to view that resource");
    res.redirect("/login");
  }
};
