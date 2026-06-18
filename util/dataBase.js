const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("Gaming-Hub", "root", "2715", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
