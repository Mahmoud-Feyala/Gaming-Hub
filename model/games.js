const { Sequelize } = require("sequelize");
const sequelize = require("../util/dataBase");

const Game = sequelize.define("game", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  genre: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  developer: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  platform: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  year: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },

  badge: {
    type: Sequelize.STRING,
    allowNull: true,
  },

  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  trailerUrl: {
    type: Sequelize.STRING,
    allowNull: true,
  },

  tags: {
    type: Sequelize.TEXT,
    allowNull: true,
  },

  description: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
});

module.exports = Game;
