const express = require("express");
const path = require("path");
require("dotenv").config();
const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");
const errorController = require("./controller/error");
const mongoConnect = require("./util/database").mongoConnect;
const bodyParser = require("body-parser");
const app = express();
app.set("view engine", "ejs");
app.set("views", "views");

const Game = require("./model/games.js");
const Library = require("./model/library.js");
const LibraryItem = require("./model/library-item.js");
const User = require("./model/user.js");
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));
app.use(userRouter);
app.use("/admin", adminRouter);
app.use(errorController.get404);

mongoConnect(() => {
  app.listen(3000);
});