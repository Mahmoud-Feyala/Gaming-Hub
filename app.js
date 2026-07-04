const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user.js");
const errorController = require("./controller/error");
const bodyParser = require("body-parser");
const app = express();
app.set("view engine", "ejs");
app.set("views", "views");

const Game = require("./model/games.js");
// const Library = require("./model/library.js");
// const LibraryItem = require("./model/library-item.js");
const User = require("./model/user.js");
app.use((req, res, next) => {
  User.findOne()
    .then((user) => {
      if (!user) {
        const newUser = new User({
          name: "kage",
          email: "test@gmail.com",
          library: [],
        });
        return newUser.save();
      }
      return user;
    })
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));
app.use(userRouter);
app.use("/admin", adminRouter);
app.use(errorController.get404);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    return User.findOne();
  })
  .then((user) => {
    if (user) {
      return;
    }

    const newUser = new User({
      name: "kage",
      email: "test@gmail.com",
      library: [],
    });

    return newUser.save();
  })
  .then(() => {
    app.listen(4000);
  })
  .catch((err) => {
    console.log(err);
  });
