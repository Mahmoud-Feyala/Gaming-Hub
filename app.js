const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const { csrfSync } = require("csrf-sync");
const flash = require("connect-flash");
require("dotenv").config();

// Routes
const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");
const authRoutes = require("./routes/auth");

// Controllers
const errorController = require("./controller/error");

// Models
const User = require("./model/user");

const app = express();

// ======================
// View Engine
// ======================
app.set("view engine", "ejs");
app.set("views", "views");

// ======================
// Database Session Store
// ======================
const store = MongoStore.create({
  mongoUrl: process.env.MONGO_URI,
});

// ======================
// CSRF
// ======================
const { csrfSynchronisedProtection, generateToken } = csrfSync({
  getTokenFromRequest: (req) => req.body._csrf,
});

// ======================
// Global Middleware
// ======================
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "my very secret hash",
    resave: false,
    saveUninitialized: false,
    store,
  })
);

// CSRF Middleware
app.use(csrfSynchronisedProtection);
app.use(flash());
// Load Logged In User
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }

      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

// Global View Variables
app.use((req, res, next) => {
  res.locals.isAuth = req.session.isLoggedIn;
  res.locals.csrfToken = generateToken(req);
  next();
});

// ======================
// Routes
// ======================
app.use(authRoutes);
app.use(userRouter);
app.use("/admin", adminRouter);
// ======================
// 404
// ======================
app.get("/500", errorController.get500);
app.use(errorController.get404);
// error

app.use((error, req, res, next) => {
  res.redirect("/500");
});
// ======================
// Database Connection
// ======================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(3000, () => {
      console.log("Server running on http://localhost:3000");
    });
  })
  .catch((err) => {
    console.error(err);
  });
