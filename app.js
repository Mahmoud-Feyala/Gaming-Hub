const express = require("express");
const path = require("path");
const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");
const errorController = require("./controller/error");
const bodyParser = require("body-parser");
const app = express();
const { Sequelize } = require("sequelize");
const sequelize = require("./util/dataBase.js");

app.set("view engine", "ejs");
app.set("views", "views");
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));
app.use(userRouter);
app.use("/admin", adminRouter);
app.use(errorController.get404);
sequelize
  .sync()
  .then((result) => {
    // console.log(result);
  })
  .catch((err) => {
    console.log(err);
  });
app.listen(3000);
