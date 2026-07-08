const User = require("../model/user");
const bcrypt = require("bcrypt");

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.redirect("/login");
      }

      return bcrypt.compare(password, user.password).then((doMatch) => {
        if (!doMatch) {
          return res.redirect("/login");
        }

        req.session.isLoggedIn = true;
        req.session.user = user;

        req.session.save((err) => {
          if (err) {
            console.log(err);
            return res.redirect("/login");
          }

          res.redirect("/");
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/login");
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

exports.getLogin = (req, res, next) => {
  res.render("user/login", {
    path: "/login",
    pageTitle: "Login",
    isAuth: false,
  });
};

exports.getregisterPage = (req, res, next) => {
  res.render("user/register.ejs", {
    pageTitle: "Create Account — Gaming Hub",
    isAuth: false,
  });
};
exports.postSignup = (req, res, next) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const favoriteGenre = req.body.favoriteGenre;

  if (password !== confirmPassword) {
    return res.redirect("/signup");
  }

  User.findOne({ email: email })
    .then((existingUser) => {
      if (existingUser) {
        return res.redirect("/signup");
      }

      return bcrypt.hash(password, 12).then((hashedPassword) => {
        const user = new User({
          firstName,
          lastName,
          username,
          email,
          password: hashedPassword,
          library: [],
        });

        return user.save();
      });
    })
    .then((result) => {
      if (result) {
        res.redirect("/login");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
