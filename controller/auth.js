const crypto = require("crypto");
const User = require("../model/user");
const bcrypt = require("bcrypt");
const sgMail = require("@sendgrid/mail");
const { validationResult } = require("express-validator");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.getLogin = (req, res, next) => {
  res.render("user/login", {
    path: "/login",
    pageTitle: "Login",
    isAuth: false,
    error: req.flash("error"),
    success: req.flash("success"),
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password.");
        return res.redirect("/login");
      }

      return bcrypt.compare(password, user.password).then((doMatch) => {
        if (!doMatch) {
          req.flash("error", "Invalid email or password.");
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

exports.getSignup = (req, res, next) => {
  res.render("user/register.ejs", {
    path: "/signup",
    pageTitle: "Create Account — Gaming Hub",
    isAuth: false,
    error: req.flash("error"),
    success: req.flash("success"),
    oldInput: {},
    validationErrors: [],
  });
};

exports.postSignup = (req, res, next) => {
  const {
    firstName,
    lastName,
    username,
    email,
    password,
    confirmPassword,
    favoriteGenre,
  } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("user/register.ejs", {
      pageTitle: "Signup",
      path: "/signup",
      error: errors.array()[0].msg,
      oldInput: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        email: req.body.email,
        favoriteGenre: req.body.favoriteGenre,
      },
      validationErrors: errors.array(),
    });
  }

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        req.flash("error", "An account with this email already exists.");
        throw new Error("EMAIL_EXISTS");
      }

      return bcrypt.hash(password, 12);
    })
    .then((hashedPassword) => {
      const user = new User({
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
        favoriteGenre,
        library: [],
      });

      return user.save();
    })
    .then((savedUser) => {
      return sgMail
        .send({
          to: email,
          from: "hana34.hany34@gmail.com",
          subject: "Welcome to Gaming Hub 🎮",
          html: `
            <div style="max-width:600px;margin:0 auto;padding:30px;font-family:Arial,sans-serif;background:#f8f9fa;border-radius:10px;">
              <h1 style="color:#6c5ce7;">🎮 Welcome to Gaming Hub!</h1>
              <p>Hello ${firstName},</p>
              <p>Thank you for signing up! Your account has been created successfully.</p>
              <p>Start exploring thousands of games, share your reviews, and build your personal gaming library.</p>
              <a href="http://localhost:3000" style="display:inline-block;padding:12px 24px;background:#6c5ce7;color:#fff;text-decoration:none;border-radius:6px;">
                Visit Gaming Hub
              </a>
              <p style="margin-top:30px;">
                Happy Gaming!<br>
                <strong>The Gaming Hub Team</strong>
              </p>
            </div>
          `,
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .then(() => {
      req.flash("success", "Account created! You can log in now.");
      return res.redirect("/login");
    })
    .catch((err) => {
      if (err.message === "EMAIL_EXISTS") {
        return res.redirect("/signup");
      }

      console.log(err);
      req.flash("error", "Something went wrong. Please try again.");
      return res.redirect("/signup");
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

exports.getForgotPassword = (req, res, next) => {
  res.render("auth/forgot-password.ejs", {
    path: "/forgot-password",
    pageTitle: "Forgot Password",
    isAuth: false,
    error: req.flash("error"),
    success: req.flash("success"),
  });
};

exports.postForgotPassword = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      req.flash("error", "Something went wrong. Please try again.");
      return res.redirect("/forgot-password");
    }

    const token = buffer.toString("hex");

    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          throw new Error("USER_NOT_FOUND");
        }

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;

        return user.save().then(() => {
          return sgMail.send({
            to: user.email,
            from: "hana34.hany34@gmail.com",
            subject: "Reset Your Gaming Hub Password",
            html: `
              <h2>Password Reset Request</h2>
              <p>Hello ${user.firstName || user.username},</p>
              <p>We received a request to reset your Gaming Hub password.</p>
              <p>Click the button below to create a new password:</p>
              <p><a href="http://localhost:3000/reset-password/${token}" style="display:inline-block;padding:12px 24px;background:#00e0e0;color:#000;text-decoration:none;border-radius:8px;font-weight:bold;">Reset Password</a></p>
              <p>Or copy this link into your browser:</p>
              <p>http://localhost:3000/reset-password/${token}</p>
              <p>This link will expire in <strong>1 hour</strong>.</p>
              <br>
              <p>If you didn't request this, you can safely ignore this email.</p>
              <hr>
              <p><strong>Gaming Hub Team 🎮</strong></p>`,
          });
        });
      })
      .then(() => {
        req.flash(
          "success",
          "If that email is registered, a reset link is on its way."
        );
        res.redirect("/login");
      })
      .catch((err) => {
        if (err.message === "USER_NOT_FOUND") {
          req.flash(
            "success",
            "If that email is registered, a reset link is on its way."
          );
          return res.redirect("/login");
        }

        console.log(err.response?.body || err);
        req.flash("error", "Something went wrong. Please try again.");
        res.redirect("/forgot-password");
      });
  });
};

exports.getResetPassword = (req, res, next) => {
  const token = req.params.token;

  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user) {
        req.flash("error", "This reset link is invalid or has expired.");
        return res.redirect("/forgot-password");
      }

      res.render("auth/reset-password.ejs", {
        path: "/reset-password",
        pageTitle: "Reset Password",
        isAuth: false,
        token: token,
        error: req.flash("error"),
        success: req.flash("success"),
      });
    })
    .catch((err) => {
      console.log(err);
      req.flash("error", "Something went wrong. Please try again.");
      res.redirect("/forgot-password");
    });
};

exports.postResetPassword = (req, res, next) => {
  const { password, confirmPassword } = req.body;
  const token = req.params.token;

  if (password !== confirmPassword) {
    req.flash("error", "Passwords do not match.");
    return res.redirect(`/reset-password/${token}`);
  }
  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user) {
        throw new Error("INVALID_TOKEN");
      }

      return bcrypt.hash(password, 12).then((hashedPassword) => {
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        return user.save();
      });
    })
    .then(() => {
      req.flash("success", "Password updated. You can log in now.");
      res.redirect("/login");
    })
    .catch((err) => {
      if (err.message === "INVALID_TOKEN") {
        req.flash("error", "This reset link is invalid or has expired.");
        return res.redirect("/forgot-password");
      }

      console.log(err);
      req.flash("error", "Something went wrong. Please try again.");
      res.redirect(`/reset-password/${token}`);
    });
};
