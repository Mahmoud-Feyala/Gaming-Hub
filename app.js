const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;

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
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
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
app.use(errorController.get404);

// ======================
// Database Connection
// ======================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => User.findOne())
  .then((user) => {
    if (user) return;

    const newUser = new User({
      name: "kage",
      email: "test@gmail.com",
      library: [],
    });

    return newUser.save();
  })
  .then(() => {
    app.listen(4000, () => {
      console.log("Server running on http://localhost:4000");
    });
  })
  .catch((err) => {
    console.error(err);
  });
