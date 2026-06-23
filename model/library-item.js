const { Sequelize } = require("sequelize");
const sequelize = require("../util/dataBase");

const LibraryItem = sequelize.define("libraryItem", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = LibraryItem;
