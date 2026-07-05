const User = require("../model/user");
exports.getLogin = (req, res, next) => {
  res.render("user/login", {
    path: "/login",
    pageTitle: "Login",
    isAuth: false,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById("6a4937cc087c9b109fd130bd").then((user) => {
    req.session.isLoggedIn = true;
    req.session.user = user;

    req.session.save((err) => {
      console.log("saved", err);
      res.redirect("/");
    });
  });
};
exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }

    res.clearCookie("connect.sid", { path: "/" });
    res.redirect("/");
  });
};

exports.getRegesterPage = (req, res, next) => {
  res.render("user/register.ejs", {
    pageTitle: "Create Account — Gaming Hub",
    isAuth: false,
  });
};
