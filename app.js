const express = require("express");
const path = require("path");
const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");
const errorController = require("./controller/error");
const bodyParser = require("body-parser");
const app = express();
const { Sequelize } = require("sequelize");
const sequelize = require("./util/dataBase.js");

const Game = require("./model/games.js");
const Library = require("./model/library.js");
const LibraryItem = require("./model/library-item.js");
const User = require("./model/user.js");

Library.belongsToMany(Game, { through: LibraryItem });
Game.belongsToMany(Library, { through: LibraryItem });
Game.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Game);
User.hasOne(Library);
Library.belongsTo(User);
app.set("view engine", "ejs");
app.set("views", "views");
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});
app.use(express.static(path.join(__dirname, "public")));
app.use(userRouter);
app.use("/admin", adminRouter);
app.use(errorController.get404);
sequelize
  .sync()
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "kage", email: "kage@gmail.com" });
    }
    return user;
  })
  .then((user) => {
    return user.getLibrary().then((library) => {
      if (!library) {
        return user.createLibrary();
      }
      return library;
    });
  })
  .then((library) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
